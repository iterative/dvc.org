const parseLink = require('./parse-link.js')

async function createMarkdownAuthorNode(api, { parentNode, createChildNode }) {
  if (parentNode.relativeDirectory.split('/')[0] !== 'authors') return
  const { node, createNodeId, createContentDigest } = api
  const { frontmatter, rawMarkdownBody } = node
  const { path, name, avatar, links } = frontmatter
  const { relativePath, name: filename } = parentNode

  const fieldData = {
    sourcePath: relativePath,
    rawMarkdownBody,
    path,
    name,
    avatar,
    links: links.map(parseLink),
    slug: `/authors/${filename}`
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
  return createChildNode(authorNode)
}

module.exports = createMarkdownAuthorNode
