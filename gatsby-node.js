/* eslint-env node */

const path = require('path')
const GithubSlugger = require('github-slugger')

const { getItemBySource } = require('./src/utils/sidebar')

const slugger = new GithubSlugger()

// Generate hedinga data from markdown

const SLUG_REGEXP = /\s+{#([a-z0-9-]*[a-z0-9]+)}\s*$/

function extractSlugFromTitle(title) {
  // extracts expressions like {#too-many-files} from the end of a title
  const meta = title.match(SLUG_REGEXP)

  if (meta) {
    return [title.substring(0, meta.index), meta[1]]
  }
  return [title, slugger.slug(title)]
}

const parseHeadings = text => {
  const headingRegex = /\n(## \s*)(.*)/g
  const matches = []
  let match
  do {
    match = headingRegex.exec(text)
    if (match) {
      const [title, slug] = extractSlugFromTitle(match[2])
      matches.push({
        text: title,
        slug: slug
      })
    }
  } while (match)

  slugger.reset()
  return matches
}

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    const docsPath = path.join(__dirname, 'content')

    const source = node.fileAbsolutePath.replace(docsPath, '')

    const { path: value } = getItemBySource(source)

    createNodeField({
      name: 'slug',
      node,
      value
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const docPage = path.resolve('./src/templates/doc.js')

  const result = await graphql(
    `
      {
        docs: allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/content/docs/" } }
          limit: 9999
        ) {
          edges {
            node {
              rawMarkdownBody
              fields {
                slug
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  const docs = result.data.docs.edges

  docs.forEach(doc => {
    const headings = parseHeadings(doc.node.rawMarkdownBody)

    if (doc.node.fields.slug) {
      createPage({
        component: docPage,
        path: doc.node.fields.slug,
        context: {
          slug: doc.node.fields.slug,
          headings
        }
      })
    }
  })
}
