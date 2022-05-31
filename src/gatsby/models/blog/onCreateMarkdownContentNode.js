require('dotenv').config()
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const mkdirp = require('mkdirp')
const path = require('path')
const sharp = require('sharp')

const { isProduction } = require('../../../server/utils.js')
const { markdownToHtml } = require('../../common.js')
const { BLOG } = require('../../../consts')

async function addPictureMetaTagPath(picture) {
  const dirPath = path.dirname(path.join(__basedir, 'public', 'blog', picture))
  await mkdirp(dirPath, { recursive: true })
  return sharp(path.join(__basedir, 'static', 'uploads', picture))
    .resize({ width: BLOG.imageMaxWidthHero })
    .toFile(path.join(__basedir, 'public', 'blog', picture))
    .catch(err => {
      console.error(err)
    })
}

async function createMarkdownBlogNode(api, { parentNode, createChildNode }) {
  if (parentNode.relativeDirectory.split('/')[0] !== 'blog') return
  const { node, createNodeId, createContentDigest } = api
  const { frontmatter, rawMarkdownBody, fileAbsolutePath } = node
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
  let gitDateTime
  if (process.env.CI) {
    const { stdout } = await exec(
      `git log -1 --pretty=format:%aI ${fileAbsolutePath}`
    )
    gitDateTime = stdout
  }
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
    sourcePath: relativePath,
    gitDateTime
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
    await mkdirp(path.join(__basedir, 'public', 'blog', 'images'), {
      recursive: true
    })
    await addPictureMetaTagPath(path.join('images', picture))
  }

  return createChildNode(postNode)
}

module.exports = createMarkdownBlogNode
