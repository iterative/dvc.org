const path = require('path')
const LIMIT_BLOG_PAGES = Boolean(process.env.LIMIT_BLOG_PAGES)

const createPages = async ({ graphql, actions }) => {
  const blogResponse = await graphql(
    `
      query AllAuthorBuilderQuery($limit: Int!) {
        allAuthor(limit: $limit) {
          nodes {
            id
            slug
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
    authors.map(({ id, slug }, index) => {
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
        path: slug
      })
    })
  )
}

module.exports = createPages
