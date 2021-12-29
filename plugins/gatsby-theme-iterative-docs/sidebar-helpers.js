/* eslint-env node */
/*
  These helpers normalize sidebar structure and create all the resources needed.
  This prevents future recalculations.

  Target structure example:

  {
    label: "Add Files or Directories",
    path: "/doc/start/add-files",
    source: "/doc/start/add-files.md",
    prev: "/doc/start/configure",
    next: "/doc/start/share-data",
    icon: "house",
    style: "customClass",
    tutorials: {
      katacoda: "https://www.katacoda.com/dvc/courses/get-started"
    }
    children: []
  }
*/

const { PATH_ROOT } = require('./constants')

function findItemByField(data, field, targetValue) {
  if (data.length) {
    for (let i = 0; i < data.length; i++) {
      const { children } = data[i]

      if (data[i][field] === targetValue) {
        return data[i]
      } else if (children) {
        const result = findItemByField(children, field, targetValue)
        if (result) {
          return result
        }
      }
    }
  }
}

function findChildWithSource(item) {
  // Return item unchanged if isn't root-relative
  if (!item.path.startsWith('/')) return item
  return item.source
    ? item
    : findChildWithSource(item.children && item.children[0])
}

function getFirstPage(normalizedSidebar) {
  return findChildWithSource(normalizedSidebar[0]).path
}

function getItemByPath(normalizedSidebar, path) {
  const normalizedPath = path.replace(/\/$/, '')
  const isRoot = normalizedPath === PATH_ROOT
  const item = isRoot
    ? normalizedSidebar[0]
    : findItemByField(normalizedSidebar, 'path', normalizedPath)

  if (!item) return false

  return findChildWithSource(item)
}

function getItemBySource(normalizedSidebar, source) {
  const item = findItemByField(normalizedSidebar, 'source', source)

  return item || false
}

function getPathWithSource(normalizedSidebar, path) {
  return getItemByPath(normalizedSidebar, path).path
}
function getParentsListFromPath(path) {
  // If path is the homepage, indicate that it's the only one active.
  // This will have to change if we add children under home, but we don't currently.
  if (path === PATH_ROOT) return [PATH_ROOT]

  let currentPath = PATH_ROOT

  return path
    .replace(PATH_ROOT + '/', '')
    .split('/')
    .map(part => {
      const path = `${currentPath}/${part}`
      currentPath = path

      return path
    })
}
module.exports = {
  findItemByField,
  findChildWithSource,
  getItemByPath,
  getItemBySource,
  getPathWithSource,
  getParentsListFromPath,
  getFirstPage
}
