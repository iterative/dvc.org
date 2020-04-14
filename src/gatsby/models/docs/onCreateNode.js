const path = require('path')

function createMarkdownDocsNode(api, options, { parentNode }) {
  const splitDir = parentNode.relativeDirectory.split('/')
  if (splitDir[0] !== 'docs') return
  // Make a special exemption for the root doc.

  const { node, actions, createNodeId, createContentDigest } = api
  const { createNode, createParentChildLink } = actions
  const { name, relativePath } = parentNode
  splitDir[0] = 'doc'

  const pagePath =
    parentNode.relativePath === 'docs/index.md'
      ? '/doc/home'
      : path.posix.join('/', ...splitDir, name === 'index' ? '/' : name)

  const fieldData = {
    slug: pagePath,
    rawMarkdownBody: node.rawMarkdownBody,
    sourcePath: relativePath
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

  createNode(docNode)
  createParentChildLink({ parent: node, child: docNode })
}

module.exports = createMarkdownDocsNode
