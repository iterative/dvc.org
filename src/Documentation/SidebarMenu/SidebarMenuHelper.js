import startCase from 'lodash.startcase'
import kebabCase from 'lodash.kebabcase'
import sidebar from '../sidebar'

export const PATH_SEPARATOR = '/'
export const PATH_TO_DOC = '/doc'

export default class SidebarMenuHelper {
  static fillFilesArray(section, file, arr) {
    let folder = SidebarMenuHelper.getParentFolder(file, section)
    let filename = SidebarMenuHelper.extractFilename(file)
    let path = SidebarMenuHelper.getFullPath(folder, filename)
    arr[path] = startCase(
      SidebarMenuHelper.removeExtensionFromFileName(filename)
    )
  }

  static isString = obj => typeof obj === 'string'

  static transformAbsoluteToDocRelatedPath = path =>
    path
      .join(PATH_SEPARATOR)
      .replace(new RegExp(PATH_TO_DOC, 'i'), '')
      .split(PATH_SEPARATOR)
      .filter(_ => _)

  static combineToPath = subPaths => [].concat(subPaths).join(PATH_SEPARATOR)

  static getZeroFile = arr => {
    const firstItem = arr[0]
    const { files, indexFile } = firstItem
    return (
      (files && SidebarMenuHelper.getZeroFile(files)) || indexFile || firstItem
    )
  }

  static findFileByName = (item, find) => {
    let file = null
    if (
      SidebarMenuHelper.removeExtensionFromFileName(item.indexFile || item) ===
      find
    ) {
      file = item
    } else if (kebabCase(item.name || '') === find) {
      file = item.files[0]
    }
    return file
  }

  static getFile = (arr, find, indexPush, setFile) => {
    arr.forEach((item, index) => {
      let newfile = SidebarMenuHelper.findFileByName(item, find)
      if (newfile) {
        indexPush(index)
        setFile(newfile)
      } else if (item.files) {
        SidebarMenuHelper.getFile(item.files, find, indexPush, setFile)
      }
    })
  }

  static getFileFromUrl = path => {
    let indexes = [],
      file = SidebarMenuHelper.getZeroFile(sidebar),
      newpath = SidebarMenuHelper.transformAbsoluteToDocRelatedPath(path)
    newpath.forEach(part => {
      SidebarMenuHelper.getFile(
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
      let path = SidebarMenuHelper.getFullPath(folder, indexFile)
      name = names[path]
    }
    return name
  }

  static getNamesArr = json => {
    let arr = {}
    json.map(section => {
      section.files.map(file => {
        SidebarMenuHelper.fillFilesArray(section, file, arr)
        if (SidebarMenuHelper.hasChildrenFiles(file)) {
          file.files.map(subFile => {
            SidebarMenuHelper.fillFilesArray(section, subFile, arr)
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
      let path = SidebarMenuHelper.getFullPath(folder, elem)
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
    if (SidebarMenuHelper.isString(filename))
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
      subfolder && SidebarMenuHelper.combineToPath([subfolder, file.indexFile])
    return path || SidebarMenuHelper.combineToPath([sect.folder, file])
  }

  static getFullPath(folder, file) {
    return (
      folder &&
      SidebarMenuHelper.combineToPath([folder, file.indexFile || file])
    )
  }

  static extractFilename(file) {
    return SidebarMenuHelper.isString(file) ? file : file.indexFile
  }

  static getParentFolder(file, section) {
    return file.folder || section.folder
  }
}
