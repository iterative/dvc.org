function createMarkdownAuthorNode(api, options, { parentNode }) {
  if (parentNode.relativeDirectory.split('/')[0] !== 'authors') return
  const { node, actions, createNodeId, createContentDigest } = api
  const { createNode, createParentChildLink } = actions
  const { frontmatter, rawMarkdownBody } = node
  const { path, name, avatar } = frontmatter
  const { relativePath } = parentNode

  const fieldData = {
    sourcePath: relativePath,
    rawMarkdownBody,
    path,
    name,
    avatar
  }

  const authorNode = {
    ...fieldData,
    id: createNodeId(`MarkdownAuthor >>> ${node.id}`),
    parent: node.id,
    children: [],
    internal: {
      type: `Author`,
      contentDigest: createContentDigest(fieldData)
    }
  }
  createNode(authorNode)
  createParentChildLink({ parent: node, child: authorNode })
}

module.exports = createMarkdownAuthorNode
