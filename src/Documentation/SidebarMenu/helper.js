import startCase from 'lodash.startcase'

import sidebar from '../sidebar'

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
  const isSourceDisabled = source === false // is source set to 'false'?

  if (!slug) {
    throw Error("'slug' field is required in objects in sidebar.json")
  }

  if (isSourceDisabled && (!children || !children.length)) {
    throw Error(
      "If you set 'source' to false, you had to add at least one child"
    )
  }
}

// Global cache vars used in normalization

let prevReference // Save last item here to generate the prev field
const normalizedSidebar = [] // Current state of sidebar to search for prev

// Normalization

function normalizeItem(item, parentPath) {
  validateRawItem(item)

  const { label, slug, source } = item

  // If prev item doesn't have source we need to recirsively search for it
  const prevItemWithSource =
    prevReference && findPrevItemWithSource(normalizedSidebar, prevReference)

  const prev = prevItemWithSource && prevItemWithSource.path

  const sourceFileName = source ? source : slug + FILE_EXTENSION
  const sourcePath = FILE_ROOT + parentPath + sourceFileName

  return {
    path: PATH_ROOT + parentPath + slug,
    source: source === false ? false : sourcePath,
    label: label ? label : startCase(slug),
    prev,
    next: undefined
  }
}

function normalizeSidebar(data, parentPath, currentSidebar) {
  data.forEach(item => {
    const isShortcut = typeof item === 'string'
    const fullItem = isShortcut ? { slug: item } : item
    const normalizedItem = normalizeItem(fullItem, parentPath)

    if (prevReference) {
      prevReference.next = normalizedItem.path
    }

    prevReference = normalizedItem // Set it before children to preserve order

    if (item.children) {
      const newParentPath = `${parentPath}${item.slug}/`
      normalizedItem.children = []
      normalizeSidebar(item.children, newParentPath, normalizedItem.children)
    }

    currentSidebar.push(normalizedItem)
  })
}

normalizeSidebar(sidebar, '', normalizedSidebar) // Init normalization

// Exports

export function getItemByPath(path) {
  const isRoot = path === PATH_ROOT.slice(0, -1)
  const item = isRoot ? normalizedSidebar[0] : findItem(normalizedSidebar, path)

  return item && findChildWithSource(item)
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
