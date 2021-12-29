const { PATH_ROOT, FILE_ROOT, FILE_EXTENSION } = require('./constants')

const { findItemByField } = require('./sidebar-helpers')

const { titleCase } = require('title-case')

function dvcTitleCase(slug) {
  return titleCase(slug.replace(/dvc/g, 'DVC').replace(/-/g, ' '))
}

function findPrevItemWithSource(data, item) {
  if (item && item.source) {
    return item
  } else if (item && item.prev) {
    const prevItem = findItemByField(data, 'path', item.prev)

    return findPrevItemWithSource(data, prevItem)
  }
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

function normalizeSidebar(
  data,
  { parentPath = '', parentResultRef, startingPrevRef } = {}
) {
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
      normalizedItem.children = normalizeSidebar(rawItem.children, {
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

module.exports = normalizeSidebar
