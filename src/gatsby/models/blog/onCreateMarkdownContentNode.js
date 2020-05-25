const { markdownToHtml } = require('../../common.js')

async function createMarkdownBlogNode(api, { parentNode, createChildNode }) {
  if (parentNode.relativeDirectory.split('/')[0] !== 'blog') return
  const { node, createNodeId, createContentDigest } = api
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

  const slug = /[-\d]*(.*)/.exec(name)[1]

  const pagePath = '/blog/' + slug
  const fieldData = {
    slug: pagePath,
    rawMarkdownBody,
    date,
    tags,
    title,
    author,
    description,
    descriptionLong: markdownToHtml(descriptionLong),
    commentsUrl,
    picture,
    pictureComment: markdownToHtml(pictureComment),
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
  return createChildNode(postNode)
}

module.exports = createMarkdownBlogNode
