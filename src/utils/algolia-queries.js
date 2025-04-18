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
        gitDateTime
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
    gitDateTime,
    parent: { excerpt },
    ...rest
  }
}) {
  return {
    objectID: id,
    excerpt,
    modified: gitDateTime,
    ...rest
  }
}

const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => data.pages.edges.map(pageToAlgoliaRecord),
    matchFields: ['slug', 'modified'],
    indexName,
    settings: { attributesToSnippet: [`excerpt:20`] }
  }
]

module.exports = queries
