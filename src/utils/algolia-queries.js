// eslint-disable-next-line @typescript-eslint/no-var-requires
const escapeStringRegexp = require('escape-string-regexp')
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const pagePath = `content/blog`
const indexName = process.env.ALGOLIA_INDEX_NAME || 'dev_blogs'

const pageQuery = `{
  pages: allMarkdownRemark(
    filter: {
      fileAbsolutePath: { regex: "/${escapeStringRegexp(pagePath)}/" },
    }
  ) {
    edges {
      node {
        id
        frontmatter {
          title
          description
        }
        excerpt(pruneLength: 5000)
      }
    }
  }
}`

function pageToAlgoliaRecord({ node: { id, frontmatter, ...rest } }) {
  return {
    objectID: id,
    ...frontmatter,
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
