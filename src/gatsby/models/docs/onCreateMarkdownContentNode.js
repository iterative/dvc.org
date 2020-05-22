const path = require('path')

function createMarkdownDocsNode(api, { parentNode }) {
  const splitDir = parentNode.relativeDirectory.split('/')
  if (splitDir[0] !== 'docs') return

  const { node, actions, createNodeId, createContentDigest } = api
  const { createNode, createParentChildLink } = actions
  const { name, relativePath } = parentNode
  splitDir[0] = 'doc'

  const slug = path.posix.join('/', ...splitDir, name === 'index' ? '' : name)

  const fieldData = {
    slug,
    rawMarkdownBody: node.rawMarkdownBody,
    sourcePath: relativePath,
    template: node.frontmatter.template
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
