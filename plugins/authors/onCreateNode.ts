import { GatsbyNode } from 'gatsby'

import parseLink from './parse-link'

interface IAuthorFrontmatter {
  path: string
  name: string
  avatar: string
  links: string[]
}

export const onCreateNode: GatsbyNode['onCreateNode'] = async ({
  node,
  getNode,
  createNodeId,
  createContentDigest,
  actions: { createParentChildLink, createNode }
}) => {
  if (node.internal.type !== `MarkdownRemark` || !node.parent) return

  const parentNode = getNode(node.parent)
  if (!parentNode || parentNode.sourceInstanceName !== `authors`) return
  const { frontmatter, rawMarkdownBody } = node as unknown as {
    frontmatter: IAuthorFrontmatter
    rawMarkdownBody: string
  }
  const { path, name, avatar, links } = frontmatter
  const { relativePath, name: filename } = parentNode

  const fieldData = {
    sourcePath: relativePath,
    rawMarkdownBody,
    path,
    name,
    links: links.map(parseLink),
    avatar,
    filename
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
  await createNode(authorNode)
  createParentChildLink({ parent: node, child: authorNode })
}
