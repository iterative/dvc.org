import startCase from 'lodash.startcase'

export default class SidebarMenuHelper {
  static fillFilesArray(section, file, arr) {
    let folder = SidebarMenuHelper.getParentFolder(file, section)
    let filename = SidebarMenuHelper.extractFilename(file)
    let path = SidebarMenuHelper.getFullPath(folder, filename)
    arr[path] = startCase(
      SidebarMenuHelper.removeExtensionFromFileName(filename)
    )
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
    return filename
      .split('.')
      .slice(0, -1)
      .join('.')
  }

  static getFullPath(folder, file) {
    return `${folder}/${file}`
  }

  static extractFilename(file) {
    return typeof file === 'string' ? file : file.indexFile
  }

  static getParentFolder(file, section) {
    return file.folder ? file.folder : section.folder
  }
}
