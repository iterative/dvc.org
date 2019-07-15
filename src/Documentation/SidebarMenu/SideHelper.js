import startCase from 'lodash.startcase'
import kebabCase from 'lodash.kebabcase'
import sidebar from '../sidebar'
import { animateScroll, scroller } from 'react-scroll/modules/index'

export const PATH_TO_DOC = '/doc'

export default class SideHelper {
  //done
  static sidebarTransform = json => {
    function run(arr) {
      return arr.map(part => {
        let oldlevel = level
        labels = part.labels || labels
        parentfolder = part.folder || parentfolder
        let indexFile =
          part.indexFile || (SideHelper.isString(part) && part) || null
        let name =
          part.name ||
          labels[indexFile] ||
          SideHelper.removeExtensionFromFileName(indexFile)
        let folder = part.folder || parentfolder
        if (part.files && part.files.length > 0) {
          level += 1
        }
        let files = part.files ? run(part.files) : []
        level = oldlevel
        return {
          name: name,
          folder: folder,
          indexFile: indexFile,
          files: files,
          level: level
        }
      })
    }
    let level = 1
    let labels = null
    let parentfolder = null
    if (json.length > 0) {
      return run(json)
    }
  }

  static fillFilesArray = (section, file, arr) => {
    let folder = file.folder
    let filename = SideHelper.extractFilename(file)
    let path = SideHelper.combineToPath([folder, filename])
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

  //done
  static getZeroFile = arr => {
    const firstItem = arr[0]
    const { files, indexFile } = firstItem
    return (
      (!indexFile &&
        files &&
        files.length > 0 &&
        SideHelper.getZeroFile(files)) ||
      indexFile
    )
  }
  //done
  static getZeroFolder = arr => {
    const firstItem = arr[0]
    const { files, folder, indexFile } = firstItem
    return (
      (!indexFile &&
        files &&
        files.length > 0 &&
        SideHelper.getZeroFile(files)) ||
      folder
    )
  }
  //done
  static findFileByName = (item, find) => {
    let indexFile = null,
      folder = null
    if (SideHelper.removeExtensionFromFileName(item.indexFile) === find) {
      indexFile = item.indexFile
      folder = item.folder
    } else if (kebabCase(item.name) === find) {
      indexFile = item.files[0].indexFile
      folder = item.files[0].folder
    }
    return {
      indexFile: indexFile,
      folder: folder
    }
  }

  //done
  static getSubsectionSlug(sectionIndex, indexFile, sidebar) {
    let section = sidebar[sectionIndex]
    let subsectionSlug
    if (section.indexFile !== indexFile) {
      section.files.map(subsection => {
        subsection.files.map(file => {
          if (file.indexFile === indexFile) {
            subsectionSlug = SideHelper.removeExtensionFromFileName(
              subsection.indexFile
            )
          }
        })
      })
    }
    return subsectionSlug
  }
  //done
  static getFileFromUrl = path => {
    let newsidebar = SideHelper.sidebarTransform(sidebar),
      pathes = SideHelper.transformAbsoluteToDocRelatedPath(path),
      file = SideHelper.getZeroFile(newsidebar),
      folder = SideHelper.getZeroFolder(newsidebar),
      lngth = pathes.length - 1,
      sectionIndex = 0,
      find = pathes[lngth]
    SideHelper.getFile(
      newsidebar,
      find,
      f => {
        file = f
      },
      f => {
        folder = f
      },
      i => {
        sectionIndex = i
      }
    )
    return {
      file: file,
      folder: folder,
      sectionIndex: sectionIndex
    }
  }

  //problem
  static getFile = (
    arr,
    find,
    setFile,
    setFolder,
    setSectionIndex,
    sectionIndex = null
  ) => {
    arr.forEach((item, index) => {
      console.log(sectionIndex || index)
      setSectionIndex(sectionIndex || index)
      let { indexFile, folder } = SideHelper.findFileByName(item, find)
      if (indexFile) {
        setFile(indexFile)
        setFolder(folder)
      } else if (item.files) {
        SideHelper.getFile(
          item.files,
          find,
          setFile,
          setFolder,
          setSectionIndex,
          index
        )
      }
    })
  }

  static getName = (labels = null, folder = null, indexFile = null, names) => {
    let name
    if (labels && labels[indexFile]) {
      name = labels[indexFile]
    } else {
      let path = SideHelper.combineToPath([folder, indexFile])
      name = names[path]
    }
    return name
  }

  static getNamesArr = json => {
    let arr = {}
    json.map(section => {
      section.files.map(file => {
        SideHelper.fillFilesArray(section, file, arr)
        if (SideHelper.hasChildrenFiles(file)) {
          file.files.map(subFile => {
            SideHelper.fillFilesArray(section, subFile, arr)
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
    array.forEach(file => {
      let path = SideHelper.combineToPath([folder, file.indexFile])
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
    if (SideHelper.isString(filename))
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
      subfolder && SideHelper.combineToPath([subfolder, file.indexFile])
    return path || SideHelper.combineToPath([sect.folder, file.indexFile])
  }

  static extractFilename(file) {
    return SideHelper.isString(file) ? file : file.indexFile
  }
}
