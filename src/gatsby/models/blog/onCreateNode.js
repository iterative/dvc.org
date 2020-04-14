function createMarkdownBlogNode(api, options, { parentNode }) {
  if (parentNode.relativeDirectory.split('/')[0] !== 'blog') return
  const { node, actions, createNodeId, createContentDigest } = api
  const { createNode, createParentChildLink } = actions
  const { frontmatter, rawMarkdownBody } = node
  const {
    date,
    tags,
    title,
    author,
    description,
    descriptionLong,
    commentsUrl,
    picture,
    pictureComment
  } = frontmatter
  const { name, relativePath } = parentNode

  const slug = name === 'index' ? '' : /[-\d]*(.*)/.exec(name)[1]

  const pagePath = '/blog/' + slug
  const fieldData = {
    slug: pagePath,
    rawMarkdownBody,
    date,
    tags,
    title,
    author,
    description,
    descriptionLong,
    commentsUrl,
    picture,
    pictureComment,
    sourcePath: relativePath
  }
  const postNode = {
    ...fieldData,
    id: createNodeId(`MarkdownBlogPost >>> ${node.id}`),
    parent: node.id,
    children: [],
    internal: {
      type: `BlogPost`,
      contentDigest: createContentDigest(fieldData)
    }
  }
  createNode(postNode)
  createParentChildLink({ parent: node, child: postNode })
}

module.exports = createMarkdownBlogNode
