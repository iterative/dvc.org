const path = require('path')

function onCreateNode(
  {
    node,
    getNode,
    createNodeId,
    createContentDigest,
    actions: { createNode, createParentChildLink }
  },
  { disable }
) {
  if (disable || node.internal.type !== 'MarkdownRemark') {
    return
  }
  const parentNode = getNode(node.parent)
  const splitDir = parentNode.relativeDirectory.split(path.sep)
  if (splitDir[0] !== 'docs') return

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

  createNode(docNode)
  createParentChildLink({ parent: node, child: docNode })
}

module.exports = onCreateNode
