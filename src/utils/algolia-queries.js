// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const indexName = process.env.GATSBY_ALGOLIA_INDEX_NAME || 'dvc_blogs'

const pageQuery = `{
  pages: allBlogPost {
    edges {
      node {
        id
        slug
        title
        description
        date
        ... on Node {
          parent {
            ... on MarkdownRemark {
              excerpt(pruneLength: 1000)
            }
          }
        }
      }
    }
  }
}`

function pageToAlgoliaRecord({
  node: {
    id,
    parent: { excerpt },
    ...rest
  }
}) {
  return {
    objectID: id,
    excerpt,
    ...rest
  }
}

const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => data.pages.edges.map(pageToAlgoliaRecord),
    indexName,
    settings: { attributesToSnippet: [`excerpt:20`] }
  }
]

module.exports = queries
