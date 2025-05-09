import path from 'node:path'

import 'dotenv/config'

import { GatsbyNode } from 'gatsby'
import { mkdirp } from 'mkdirp'
import sharp from 'sharp'

import { BLOG } from './constants'
import { blogPluginOptions } from './plugin-options'
import { isProduction } from './utils'

async function addPictureMetaTagPath(baseDir: string, picture: string) {
  const sourceImagePath = path.join(baseDir, `content`, `uploads`, picture)
  const dirPath = path.dirname(path.join(baseDir, `public`, `blog`, picture))
  await mkdirp(dirPath)
  return sharp(sourceImagePath)
    .resize({
      width: BLOG.imagePreviewWidth,
      height: BLOG.imagePreviewHeight
    })
    .toFile(path.join(baseDir, `public`, `blog`, picture))
    .catch(err => {
      console.error(err)
    })
}

const getAuthors = (
  authorField: string,
  authorsField?: string[]
): [string, string[]] => {
  if (authorsField) {
    const [primaryAuthor, ...restAuthors] = authorsField
    return [primaryAuthor, restAuthors]
  } else {
    return [authorField, []]
  }
}

interface Frontmatter {
  date: string
  tags: string[]
  title: string
  author: string
  authors: string[]
  description: string
  descriptionLong: string
  commentsUrl: string
  picture: string
  pictureComment: string
}

export const onCreateNode: GatsbyNode['onCreateNode'] = async (
  {
    node,
    getNode,
    createNodeId,
    createContentDigest,
    actions: { createParentChildLink, createNode }
  },
  pluginOptions
) => {
  if (node.internal.type !== `MarkdownRemark` || !node.parent) return

  const parentNode = getNode(node.parent)
  if (!parentNode || parentNode.sourceInstanceName !== `blogs`) return

  const { baseDir } = blogPluginOptions(pluginOptions)

  const { frontmatter, rawMarkdownBody } = node as unknown as {
    frontmatter: Frontmatter
    rawMarkdownBody: string
  }
  const {
    date,
    tags,
    title,
    author: authorField,
    authors: authorsField,
    description,
    descriptionLong,
    commentsUrl,
    picture,
    pictureComment
  } = frontmatter
  const { name, relativePath } = parentNode
  const slug = /[-\d]*(.*)/.exec(name as string)?.[1]

  const [author, contributors] = getAuthors(authorField, authorsField)

  const pagePath = `/blog/` + slug

  const fieldData = {
    slug: pagePath,
    rawMarkdownBody,
    date,
    tags,
    title,
    author,
    contributors,
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

  if (isProduction && picture) {
    await mkdirp(path.join(baseDir, `public`, `blog`, `images`))
    await addPictureMetaTagPath(baseDir, path.join(`images`, picture))
  }

  await createNode(postNode)
  createParentChildLink({ parent: node, child: postNode })
}
