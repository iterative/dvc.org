import startCase from 'lodash.startcase'

import sidebar from '../sidebar'

/*
  We will use this function to normalize sidebar structure and create
  all of the resurces we need to prevent future recalculations.

  Target structure example:

  {
    label: "Add Files or Directories",
    path: "/doc/get-started/add-files",
    source: "/static/docs/get-started/add-files.md",
    prev: "/doc/get-started/configure",
    next: "/doc/get-started/share-data",
    children: []
  }
*/

const PATH_ROOT = '/doc/'
const FILE_ROOT = '/static/docs/'
const FILE_EXTENSION = '.md'

let prevReference // We will save prev item reference here to use for the next and prev fields

function normalizeSidebar(data, parentPath) {
  return data.map(item => {
    let normalizedItem

    /*
      Edge case: If parent don't have source, we will need to return it's prev instead.
      Because only items with children can be sourceless, it's safe to go back only once.
    */
    const prev =
      prevReference &&
      (prevReference.source ? prevReference.path : prevReference.prev)

    if (typeof item === 'string') {
      normalizedItem = {
        path: PATH_ROOT + parentPath + item,
        source: FILE_ROOT + parentPath + item + FILE_EXTENSION,
        label: startCase(item),
        prev,
        next: undefined
      }
    } else {
      const { label, slug, source, children } = item

      if (!slug) {
        throw Error("'slug' field is required in objects in sidebar.json")
      }

      const isSourceDisabled = source === false // is source explictly set to 'false'?

      if (isSourceDisabled && (!children || !children.length)) {
        throw Error(
          "If you set 'source' to false, you had to add at least one child"
        )
      }

      const sourceFileName = source ? source : slug + FILE_EXTENSION
      const sourcePath = FILE_ROOT + parentPath + sourceFileName

      normalizedItem = {
        path: PATH_ROOT + parentPath + slug,
        source: isSourceDisabled ? false : sourcePath,
        label: label ? label : startCase(slug),
        prev,
        next: undefined
      }
    }

    if (prevReference) {
      prevReference.next = normalizedItem.path
    }

    prevReference = normalizedItem

    if (item.children) {
      const newParentPath = `${parentPath}${item.slug}/`
      normalizedItem.children = normalizeSidebar(item.children, newParentPath)
    }

    return normalizedItem
  })
}

const normalizedSidebar = normalizeSidebar(sidebar, '')

function findItem(data, targetPath) {
  if (data.length) {
    for (let i = 0; i < data.length; i++) {
      const { path, source, children } = data[i]

      if (path === targetPath && !source && children && children[0]) {
        // If parent have blank source and children, then return first child instead
        return children[0]
      } else if (path === targetPath) {
        // Return item normally
        return data[i]
      } else if (children) {
        // Search for match in children recursevly
        const result = findItem(children, targetPath)
        if (result) {
          return result
        }
      }
    }
  }
}

export function getItemByPath(path) {
  // Edge case for the root url, return first item instead
  if (path === PATH_ROOT.slice(0, -1)) {
    return normalizedSidebar[0]
  }

  return findItem(normalizedSidebar, path)
}

export function getParentsListFromPath(path) {
  let currentPath = PATH_ROOT.slice(0, -1)

  return path
    .replace(PATH_ROOT, '')
    .split('/')
    .map(part => {
      const path = `${currentPath}/${part}`
      currentPath = path

      return path
    })
}

export default normalizedSidebar
