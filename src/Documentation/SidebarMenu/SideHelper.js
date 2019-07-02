import startCase from 'lodash.startcase'
import kebabCase from 'lodash.kebabcase'
import sidebar from '../sidebar'
import { animateScroll, scroller } from 'react-scroll/modules/index'

export const PATH_TO_DOC = '/doc'

export default class SideHelper {
  static fillFilesArray(section, file, arr) {
    let folder = SideHelper.getParentFolder(file, section)
    let filename = SideHelper.extractFilename(file)
    let path = SideHelper.getFullPath(folder, filename)
    arr[path] = startCase(SideHelper.removeExtensionFromFileName(filename))
  }

  static initDocsearch = () => {
    docsearch({
      apiKey: '755929839e113a981f481601c4f52082',
      indexName: 'dvc',
      inputSelector: '#doc-search',
      debug: false // Set debug to true if you want to inspect the dropdown
    })
  }

  static autoScroll = () => {
    const { hash } = window.location
    if (hash) SideHelper.scrollToLink(hash)
  }

  static scrollToLink = href => {
    scroller.scrollTo(href.slice(1), {
      duration: 600,
      offset: -85,
      delay: 0,
      smooth: 'ease',
      containerId: 'bodybag'
    })
  }

  static scrollTop = () => {
    animateScroll.scrollTo(0, {
      duration: 300,
      offset: -85,
      delay: 0,
      smooth: 'ease',
      containerId: 'bodybag'
    })
  }

  static parseHeadings = text => {
    const headingRegex = /\n(## \s*)(.*)/g
    const matches = []
    let match
    do {
      match = headingRegex.exec(text)
      if (match)
        matches.push({
          text: match[2],
          slug: kebabCase(match[2])
        })
    } while (match)
    return matches
  }

  static isString = obj => typeof obj === 'string'

  static transformAbsoluteToDocRelatedPath = path =>
    path
      .join('/')
      .replace(new RegExp(PATH_TO_DOC, 'i'), '')
      .split('/')
      .filter(_ => _)

  static combineToPath = subPaths => [].concat(subPaths).join('/')

  static getZeroFile = arr => {
    const firstItem = arr[0]
    const { files, indexFile } = firstItem
    return (files && SideHelper.getZeroFile(files)) || indexFile || firstItem
  }

  static findFileByName = (item, find) => {
    let file = null
    if (
      SidebarHelper.removeExtensionFromFileName(item.indexFile || item) === find
    ) {
      file = item
    } else if (kebabCase(item.name || '') === find) {
      file = item.files[0]
    }
    return file
  }

  static getFile = (arr, find, indexPush, setFile) => {
    arr.forEach((item, index) => {
      let newfile = SidebarHelper.findFileByName(item, find)
      if (newfile) {
        indexPush(index)
        setFile(newfile)
      } else if (item.files) {
        SidebarHelper.getFile(item.files, find, indexPush, setFile)
      }
    })
  }

  static getFileFromUrl = path => {
    let indexes = [],
      file = SidebarHelper.getZeroFile(sidebar),
      newpath = SidebarHelper.transformAbsoluteToDocRelatedPath(path)
    newpath.forEach(part => {
      SidebarHelper.getFile(
        sidebar,
        part,
        i => {
          indexes.push(i)
        },
        f => {
          file = f
        }
      )
    })
    return {
      file: file,
      indexes: indexes
    }
  }

  static getName = (labels = null, folder = null, indexFile = null, names) => {
    let name
    if (labels && labels[indexFile]) {
      name = labels[indexFile]
    } else {
      let path = SidebarHelper.getFullPath(folder, indexFile)
      name = names[path]
    }
    return name
  }

  static getNamesArr = json => {
    let arr = {}
    json.map(section => {
      section.files.map(file => {
        SidebarHelper.fillFilesArray(section, file, arr)
        if (SidebarHelper.hasChildrenFiles(file)) {
          file.files.map(subFile => {
            SidebarHelper.fillFilesArray(section, subFile, arr)
          })
        }
      })
    })
    return arr
  }

  static convertToBooleanString(cond) {
    return (!!cond).toString()
  }

  static filesContains(array, folder, currentFile) {
    let flag = false
    array.forEach(elem => {
      let path = SidebarHelper.getFullPath(folder, elem)
      if (path === currentFile) {
        flag = true
      }
    })
    return flag
  }

  static hasChildrenFiles(file) {
    return file.files && file.files.length > 0
  }

  static removeExtensionFromFileName(filename) {
    if (SidebarHelper.isString(filename))
      return filename
        .split('.')
        .slice(0, -1)
        .join('.')
    else return null
  }

  static getPath(section, subsection = null, file) {
    let sect = sidebar[section]
    let subsect = sect.files[subsection]
    let subfolder = subsect && subsect.folder
    let path =
      subfolder && SidebarHelper.combineToPath([subfolder, file.indexFile])
    return path || SidebarHelper.combineToPath([sect.folder, file])
  }

  static getFullPath(folder, file) {
    return (
      folder && SidebarHelper.combineToPath([folder, file.indexFile || file])
    )
  }

  static extractFilename(file) {
    return SidebarHelper.isString(file) ? file : file.indexFile
  }

  static getParentFolder(file, section) {
    return file.folder || section.folder
  }
}
