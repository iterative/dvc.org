const path = require('path')
const tagToSlug = require('../../../utils/shared/tagToSlug')
const { BLOG } = require('../../../consts')
// Since blog pages and their indexes require a ton of image resizes, it's
// useful to have an option to only generate a minimal set of these pages when
// developing. Set LIMIT_BLOG_PAGES to anything truthy and this module will
// attempt to generate as few blog pages as possible while still having a bit of
// everything to look at.
const LIMIT_BLOG_PAGES = Boolean(process.env.LIMIT_BLOG_PAGES)

const createPages = async ({ graphql, actions }) => {
  const blogResponse = await graphql(
    `
      query AllAuthorBuilderQuery {
        allAuthor {
          nodes {
            id
            name
            link
            sourcePath
          }
        }
      }
    `,
    {
      limit: LIMIT_BLOG_PAGES ? 1 : 9999
    }
  )

  if (blogResponse.errors) {
    throw blogResponse.errors
  }

  const { nodes: authors } = blogResponse.data.allAuthor

  const authorTemplate = path.resolve('./src/templates/blog-author.tsx')

  const authorPagesPromise = Promise.all(
    authors.map(({ id, sourcePath }, index) => {
      const previous = index === authors.length - 1 ? null : authors[index + 1]
      const next = index === 0 ? null : authors[index - 1]

      actions.createPage({
        component: authorTemplate,
        context: {
          isBlog: true,
          currentPage: index + 1,
          next,
          previous,
          id
        },
        path: sourcePath.slice(0, sourcePath.indexOf('.'))
      })
    })
  )

  return Promise.all([authorPagesPromise])
}

module.exports = createPages
