/* eslint-env node */
/*
  These helpers normalize sidebar structure and create all the resources needed.
  This prevents future recalculations.

  Target structure example:

  {
    label: "Add Files or Directories",
    path: "/doc/tutorials/get-started/add-files",
    source: "/docs/tutorials/get-started/add-files.md",
    prev: "/doc/tutorials/get-started/configure",
    next: "/doc/tutorials/get-started/share-data",
    tutorials: {
      katacoda: "https://www.katacoda.com/dvc/courses/get-started/initialize"
    }
    children: []
  }
*/

const startCase = require('lodash/startCase')
const sidebar = require('../../../content/docs/sidebar.json')

const PATH_ROOT = '/doc/'
const FILE_ROOT = '/docs/'
const FILE_EXTENSION = '.md'

function validateRawItem({ slug, source, children }) {
  const isSourceDisabled = source === false

  if (typeof slug !== 'string') {
    throw Error("'slug' field is required in objects in sidebar.json")
  }

  if (isSourceDisabled && (!children || !children.length)) {
    throw Error(
      "If you set 'source' to false, you had to add at least one child"
    )
  }
}

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

function findPrevItemWithSource(data, item) {
  if (item && item.source) {
    return item
  } else if (item && item.prev) {
    const prevItem = findItemByField(data, 'path', item.prev)

    return findPrevItemWithSource(data, prevItem)
  }
}

function normalizeItem({ rawItem, parentPath, resultRef, prevRef }) {
  validateRawItem(rawItem)

  const { label, slug, source, tutorials } = rawItem

  // If prev item doesn't have source we need to search for it
  const prevItemWithSource =
    prevRef && findPrevItemWithSource(resultRef, prevRef)

  const prev = prevItemWithSource && prevItemWithSource.path

  const sourceFileName = source ? source : slug + FILE_EXTENSION
  const sourcePath = FILE_ROOT + parentPath + sourceFileName

  return {
    path: PATH_ROOT + parentPath + slug,
    source: source === false ? false : sourcePath,
    label: label ? label : startCase(slug),
    tutorials: tutorials || {},
    prev,
    next: undefined
  }
}

function normalizeSidebar({
  data,
  parentPath,
  parentResultRef,
  startingPrevRef
}) {
  const currentResult = []
  const resultRef = parentResultRef || currentResult
  let prevRef = startingPrevRef

  data.forEach(rawItem => {
    const isShortcut = typeof rawItem === 'string'
    rawItem = isShortcut ? { slug: rawItem } : rawItem
    const normalizedItem = normalizeItem({
      rawItem,
      parentPath,
      resultRef,
      prevRef
    })

    if (prevRef) {
      prevRef.next = normalizedItem.path
    }

    if (rawItem.children) {
      normalizedItem.children = normalizeSidebar({
        data: rawItem.children,
        parentPath: `${parentPath}${rawItem.slug}/`,
        parentResultRef: resultRef,
        startingPrevRef: normalizedItem
      })

      prevRef = normalizedItem.children[normalizedItem.children.length - 1]
    } else {
      prevRef = normalizedItem
    }

    currentResult.push(normalizedItem)
  })

  return currentResult
}

/*
 * Exports
 */

const normalizedSidebar = normalizeSidebar({
  data: sidebar,
  parentPath: ''
})

function findChildWithSource(item) {
  return item.source ? item : findChildWithSource(item.children[0])
}

function getFirstPage() {
  return findChildWithSource(normalizedSidebar[0]).path
}

function getItemByPath(path) {
  const normalizedPath = path.replace(/\/$/, '')
  const isRoot = normalizedPath === PATH_ROOT.slice(0, -1)
  const item = isRoot
    ? normalizedSidebar[0]
    : findItemByField(normalizedSidebar, 'path', normalizedPath)

  if (!item) return false

  return findChildWithSource(item)
}

function getItemBySource(source) {
  const item = findItemByField(normalizedSidebar, 'source', source)

  return item || false
}

function getPathWithSource(path) {
  return getItemByPath(path).path
}

function getParentsListFromPath(path) {
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

module.exports = {
  structure: normalizedSidebar,
  findChildWithSource,
  getItemByPath,
  getItemBySource,
  getPathWithSource,
  getParentsListFromPath,
  getFirstPage
}
