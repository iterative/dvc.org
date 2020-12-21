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

const { titleCase } = require('title-case')
const sidebar = require('../../../content/docs/sidebar.json')

const PATH_ROOT = '/doc'
const FILE_ROOT = '/docs/'
const FILE_EXTENSION = '.md'

function dvcTitleCase(slug) {
  return titleCase(slug.replace(/dvc/g, 'DVC').replace(/-/g, ' '))
}

function validateRawItem({ slug, source, children, type, url }) {
  const isSourceDisabled = source === false

  switch (type) {
    case 'external':
      if (typeof url !== 'string') {
        throw Error("'url' field is required in external sidebar.json entries")
      }
      break
    default:
      if (typeof slug !== 'string') {
        throw Error("'slug' field is required in local sidebar.json entries")
      }

      if (isSourceDisabled && (!children || !children.length)) {
        throw Error(
          'Local sidebar.json entries with no source must have children'
        )
      }
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

  const { label, slug, source, tutorials, type, url, style, icon } = rawItem

  const sharedFields = {
    style,
    icon
  }

  switch (type) {
    case 'external':
      return {
        type,
        path: url,
        label,
        ...sharedFields
      }
    default:
      // If prev item doesn't have source we need to search for it
      const prevItemWithSource =
        prevRef && findPrevItemWithSource(resultRef, prevRef)

      const prev = prevItemWithSource && prevItemWithSource.path

      const sourceFileName = source ? source : slug + FILE_EXTENSION
      const sourcePath = FILE_ROOT + parentPath + sourceFileName

      const relativePath = parentPath + slug

      return {
        path: relativePath ? `${PATH_ROOT}/${relativePath}` : PATH_ROOT,
        source: source === false ? false : sourcePath,
        label: label ? label : dvcTitleCase(slug),
        tutorials: tutorials || {},
        prev,
        next: undefined,
        ...sharedFields
      }
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
  // Return item unchanged if isn't root-relative
  if (!item.path.startsWith('/')) return item
  return item.source
    ? item
    : findChildWithSource(item.children && item.children[0])
}

function getFirstPage() {
  return findChildWithSource(normalizedSidebar[0]).path
}

function getItemByPath(path) {
  const normalizedPath = path.replace(/\/$/, '')
  const isRoot = normalizedPath === PATH_ROOT
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
  structure: normalizedSidebar,
  findChildWithSource,
  getItemByPath,
  getItemBySource,
  getPathWithSource,
  getParentsListFromPath,
  getFirstPage
}
