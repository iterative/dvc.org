const path = require('path')
const tagToSlug = require('../../../utils/shared/tagToSlug')
const { BLOG } = require('../../../consts')
// Since blog pages and their indexes require a ton of image resizes, it's
// useful to have an option to only generate a minimal set of these pages when
// developing. Set LIMIT_BLOG_PAGES to anything truthy and this module will
// attempt to generate as few blog pages as possible while still having a bit of
// everything to look at.
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

const getPageLimit = LIMIT_BLOG_PAGES => {
  if (LIMIT_BLOG_PAGES === undefined) return 9999
  const numberLimit = Number(LIMIT_BLOG_PAGES)
  if (numberLimit === NaN)
    throw new Error('LIMIT_BLOG_PAGES must be a number of pages!')
  return numberLimit
}

const createPages = async ({ graphql, actions }) => {
  const { LIMIT_BLOG_PAGES } = process.env
  const blogResponse = await graphql(
    `
      query BlogPageBuilderQuery($limit: Int) {
        allBlogPost(sort: { fields: [date], order: DESC }, limit: $limit) {
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
    `,
    {
      limit: getPageLimit(LIMIT_BLOG_PAGES)
    }
  )

  if (blogResponse.errors) {
    throw blogResponse.errors
  }

  const { tags, nodes: posts } = blogResponse.data.allBlogPost

  // Create home blog pages (with pagination)
  const blogHomeTemplate = path.resolve('./src/templates/blog-home.tsx')

  for (const page of pagesGenerator({
    basePath: '/blog',
    hasHeroItem: true,
    itemCount: posts.length
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

  const blogPagesPromise = Promise.all(
    posts.map(({ id, slug }, index) => {
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
  )

  // Create tags pages (with pagination)
  const blogTagsTemplate = path.resolve('./src/templates/blog-tags.tsx')

  // We have to explicitly limit tag pages here, otherwise we get one for
  // every tag on the example post that makes images for a few children.
  // That can easily add hundreds of images because of the blog index template.
  const _tags = LIMIT_BLOG_PAGES !== undefined ? tags.slice(0, 1) : tags

  const tagPagesPromise = Promise.all(
    _tags.map(({ fieldValue: tag, pageInfo: { itemCount } }) => {
      const basePath = `/blog/tags/${tagToSlug(tag)}`

      for (const page of pagesGenerator({ basePath, itemCount })) {
        actions.createPage({
          component: blogTagsTemplate,
          path: page.path,
          context: { tag, ...page.context }
        })
      }
    })
  )

  return Promise.all([tagPagesPromise, blogPagesPromise])
}

module.exports = createPages
