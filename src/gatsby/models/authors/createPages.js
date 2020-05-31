const path = require('path')
const LIMIT_BLOG_PAGES = Boolean(process.env.LIMIT_BLOG_PAGES)
const { paginate } = require('gatsby-awesome-pagination')
const {
  BLOG: { postsPerPage }
} = require('../../../consts.js')

const createPages = async ({ graphql, actions: { createPage } }) => {
  const blogResponse = await graphql(
    `
      query AllAuthorBuilderQuery($limit: Int!) {
        allAuthor(limit: $limit) {
          nodes {
            id
            slug
            posts {
              totalCount
            }
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

  return Promise.all(
    authors.map(({ id, slug, posts: { totalCount } }, index) => {
      const previous = index === authors.length - 1 ? null : authors[index + 1]
      const next = index === 0 ? null : authors[index - 1]

      paginate({
        createPage,
        itemsPerPage: postsPerPage,
        itemsPerFirstPage: 10,
        pathPrefix: slug,
        items: { length: totalCount },

        component: authorTemplate,
        context: {
          id,
          next,
          previous,
          isBlog: true
        }
      })
    })
  )
}

module.exports = createPages
