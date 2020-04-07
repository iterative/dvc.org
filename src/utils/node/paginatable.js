/* eslint-env node */
const { BLOG } = require('../../consts')

function pageUrl(basePath, page) {
  if (page > 1) {
    const basePrefix = basePath === '/' ? '' : `${basePath}/`

    return `${basePrefix}page/${page}`
  }

  return basePath
}

module.exports = function* pagesGenerator({
  itemCount,
  hasHeroItem = false,
  basePath
}) {
  let currentPage = 1
  let skip = 0

  while (skip < itemCount) {
    const limit =
      hasHeroItem && currentPage === 1
        ? BLOG.postsPerPage - BLOG.postsPerRow + 1
        : BLOG.postsPerPage

    let nextPage
    let previousPage

    if (skip + limit < itemCount) {
      nextPage = pageUrl(basePath, currentPage + 1)
    }

    if (skip > 0) {
      previousPage = pageUrl(basePath, currentPage - 1)
    }

    // For the Paginator component
    const pageInfo = { currentPage, nextPage, previousPage }

    yield {
      path: pageUrl(basePath, currentPage),
      context: { limit, pageInfo, skip }
    }

    currentPage++
    skip += limit
  }
}
