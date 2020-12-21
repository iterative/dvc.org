const path = require('path')

async function createMarkdownDocsNode(api, { parentNode, createChildNode }) {
  // Suppress page creation for Basic Concepts and the Glossary
  // They're only used in tooltips now, but we intend to expand on them later.
  if (parentNode.relativeDirectory === 'docs/user-guide/basic-concepts') return

  const splitDir = parentNode.relativeDirectory.split('/')
  if (splitDir[0] !== 'docs') return

  const { node, createNodeId, createContentDigest } = api
  const { name, relativePath } = parentNode
  splitDir[0] = 'doc'

  const slug = path.posix.join('/', ...splitDir, name === 'index' ? '' : name)

  const fieldData = {
    slug,
    rawMarkdownBody: node.rawMarkdownBody,
    sourcePath: relativePath,
    template: node.frontmatter.template,
    title: node.frontmatter.title === '' ? null : node.frontmatter.title,
    description: node.frontmatter.description
  }

  const docNode = {
    ...fieldData,
    id: createNodeId(`MarkdownDocsPage >>> ${node.id}`),
    parent: node.id,
    children: [],
    internal: {
      type: `DocsPage`,
      contentDigest: createContentDigest(fieldData)
    }
  }

  return createChildNode(docNode)
}

module.exports = createMarkdownDocsNode
