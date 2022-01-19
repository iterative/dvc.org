// eslint-disable-next-line @typescript-eslint/no-var-requires
const escapeStringRegexp = require('escape-string-regexp')
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const pagePath = `content/blog`
const indexName = process.env.GATSBY_ALGOLIA_INDEX_NAME || 'dev_blogs'

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
        childBlogPost {
          slug
        }
        excerpt(pruneLength: 1000)
      }
    }
  }
}`

function pageToAlgoliaRecord({
  node: { id, frontmatter, childBlogPost, ...rest }
}) {
  return {
    objectID: id,
    ...frontmatter,
    ...childBlogPost,
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
