const path = require('path')
const tagToSlug = require('../../../utils/shared/tagToSlug')
const { BLOG } = require('../../../consts')

const pageUrl = (basePath, page) => {
  if (page > 1) {
    const basePrefix = basePath === '/' ? '' : `${basePath}/`

    return `${basePrefix}page/${page}`
  }

  return basePath
}

function* pagesGenerator({ itemCount, hasHeroItem = false, basePath }) {
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

const createPages = async ({ graphql, actions }) => {
  const isDevMode = process.env.NODE_ENV === 'development'

  const blogResponse = await graphql(
    `
      {
        allBlogPost(sort: { fields: [date], order: DESC }, limit: 9999) {
          pageInfo {
            itemCount
          }
          tags: group(field: tags) {
            fieldValue
            pageInfo {
              itemCount
            }
          }
          nodes {
            slug
            id
          }
        }
      }
    `
  )

  if (blogResponse.errors) {
    throw blogResponse.errors
  }

  const {
    pageInfo: { itemCount },
    tags,
    nodes: posts
  } = blogResponse.data.allBlogPost

  // Create home blog pages (with pagination)
  const blogHomeTemplate = path.resolve('./src/templates/blog-home.tsx')

  for (const page of pagesGenerator({
    basePath: '/blog',
    hasHeroItem: true,
    itemCount: isDevMode ? 1 : itemCount
  })) {
    actions.createPage({
      component: blogHomeTemplate,
      path: page.path,
      context: {
        isBlog: true,
        ...page.context
      }
    })
  }

  // Create blog posts pages
  const blogPostTemplate = path.resolve('./src/templates/blog-post.tsx')

  const _posts = isDevMode ? posts.slice(0, 1) : posts
  _posts.forEach(({ id, slug }, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1]
    const next = index === 0 ? null : posts[index - 1]

    actions.createPage({
      component: blogPostTemplate,
      context: {
        isBlog: true,
        currentPage: index + 1,
        next,
        previous,
        id
      },
      path: slug
    })
  })

  // Create tags pages (with pagination)
  const blogTagsTemplate = path.resolve('./src/templates/blog-tags.tsx')

  const _tags = isDevMode ? tags.slice(0, 1) : tags
  _tags.forEach(({ fieldValue: tag, pageInfo: { itemCount } }) => {
    const basePath = `/tags/${tagToSlug(tag)}`

    for (const page of pagesGenerator({ basePath, itemCount })) {
      actions.createPage({
        component: blogTagsTemplate,
        path: page.path,
        context: { tag, ...page.context }
      })
    }
  })
}

module.exports = createPages
