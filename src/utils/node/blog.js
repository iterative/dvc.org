const path = require('path')
const tagToSlug = require('../shared/tagToSlug')
const { BLOG } = require('../../consts')

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
  const blogResponse = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: { fileAbsolutePath: { regex: "/content/blog/" } }
          limit: 9999
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
        home: allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: { fileAbsolutePath: { regex: "/content/blog/" } }
          limit: 9999
        ) {
          pageInfo {
            itemCount
          }
        }
        tags: allMarkdownRemark(limit: 9999) {
          group(field: frontmatter___tags) {
            fieldValue
            pageInfo {
              itemCount
            }
          }
        }
      }
    `
  )

  if (blogResponse.errors) {
    throw blogResponse.errors
  }

  // Create home blog pages (with pagination)
  const blogHomeTemplate = path.resolve('./src/templates/blog-home.tsx')

  for (const page of pagesGenerator({
    basePath: '/blog',
    hasHeroItem: true,
    itemCount: blogResponse.data.home.pageInfo.itemCount
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
  const posts = blogResponse.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    actions.createPage({
      component: blogPostTemplate,
      context: {
        isBlog: true,
        currentPage: index + 1,
        next,
        previous,
        slug: post.node.fields.slug
      },
      path: post.node.fields.slug
    })
  })

  // Create tags pages (with pagination)
  const blogTagsTemplate = path.resolve('./src/templates/blog-tags.tsx')

  blogResponse.data.tags.group.forEach(
    ({ fieldValue: tag, pageInfo: { itemCount } }) => {
      const basePath = `/tags/${tagToSlug(tag)}`

      for (const page of pagesGenerator({ basePath, itemCount })) {
        actions.createPage({
          component: blogTagsTemplate,
          path: page.path,
          context: { tag, ...page.context }
        })
      }
    }
  )
}

exports.createPages = createPages
