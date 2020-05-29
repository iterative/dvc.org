function parseLink(input) {
  if (typeof input === 'string') {
    const url = new URL(input)
    // Slice the 'www.' off of given hostnames to normalize them.
    const hostname = url.hostname.startsWith('www.')
      ? url.hostname.slice(4)
      : url.hostname

    switch (hostname) {
      case 'twitter.com':
        return {
          site: 'twitter',
          // Remove leading slash
          username: url.pathname.slice(1),
          url: input
        }
      case 'linkedin.com':
        return {
          site: 'linkedin',
          // Remove '/in/'
          username: url.pathname.slice(4),
          url: input
        }
      default:
        return {
          site: null,
          url: input
        }
    }
  } else {
    return input
  }
}

async function createMarkdownAuthorNode(api, { parentNode, createChildNode }) {
  if (parentNode.relativeDirectory.split('/')[0] !== 'authors') return
  const { node, createNodeId, createContentDigest } = api
  const { frontmatter, rawMarkdownBody } = node
  const { path, name, avatar, links } = frontmatter
  const { relativePath } = parentNode

  const fieldData = {
    sourcePath: relativePath,
    rawMarkdownBody,
    path,
    name,
    links: links.map(parseLink),
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
  return createChildNode(authorNode)
}

module.exports = createMarkdownAuthorNode
