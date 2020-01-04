/* eslint-env node */

const startCase = require('lodash.startcase')
const sidebar = require('../../public/static/docs/sidebar.json')

/*
  We will use this helper to normalize sidebar structure and create
  all of the resurces we need to prevent future recalculations.

  Target structure example:

  {
    label: "Add Files or Directories",
    path: "/doc/get-started/add-files",
    source: "/static/docs/get-started/add-files.md",
    prev: "/doc/get-started/configure",
    next: "/doc/get-started/share-data",
    tutorials: {
      katacoda: "https://www.katacoda.com/loodse/courses/docker/docker-02-install"
    }
    children: []
  }
*/

const PATH_ROOT = '/doc/'
const FILE_ROOT = '/static/docs/'
const FILE_EXTENSION = '.md'

// Inner helpers

function findItem(data, targetPath) {
  if (data.length) {
    for (let i = 0; i < data.length; i++) {
      const { path, children } = data[i]

      if (path === targetPath) {
        return data[i]
      } else if (children) {
        const result = findItem(children, targetPath)
        if (result) {
          return result
        }
      }
    }
  }
}

function findChildWithSource(item) {
  return item.source ? item : findChildWithSource(item.children[0])
}

function findPrevItemWithSource(data, item) {
  if (item.source) {
    return item
  } else if (item.prev) {
    const prevItem = findItem(data, item.prev)

    return findPrevItemWithSource(data, prevItem)
  }
}

function validateRawItem({ slug, source, children }) {
  const isSourceDisabled = source === false

  if (!slug) {
    throw Error("'slug' field is required in objects in sidebar.json")
  }

  if (isSourceDisabled && (!children || !children.length)) {
    throw Error(
      "If you set 'source' to false, you had to add at least one child"
    )
  }
}

// Normalization

function normalizeItem({ item, parentPath, resultRef, prevRef }) {
  validateRawItem(item)

  const { label, slug, source, tutorials } = item

  // If prev item doesn't have source we need to recirsively search for it
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
    const item = isShortcut ? { slug: rawItem } : rawItem
    const normalizedItem = normalizeItem({
      item,
      parentPath,
      resultRef,
      prevRef
    })

    if (prevRef) {
      prevRef.next = normalizedItem.path
    }

    if (item.children) {
      normalizedItem.children = normalizeSidebar({
        data: item.children,
        parentPath: `${parentPath}${item.slug}/`,
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

const normalizedSidebar = normalizeSidebar({
  data: sidebar,
  parentPath: ''
})

// Exports

function getItemByPath(path) {
  const normalizedPath = path.replace(/\/$/, '')
  const isRoot = normalizedPath === PATH_ROOT.slice(0, -1)
  const item = isRoot
    ? normalizedSidebar[0]
    : findItem(normalizedSidebar, normalizedPath)

  return item && findChildWithSource(item)
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
  getItemByPath,
  getParentsListFromPath
}
