const path = require('path')
const process = require('process')
const { createFilePath } = require('gatsby-source-filesystem')
const remark = require('remark')
const remarkHTML = require('remark-html')
const { getItemBySource } = require('../shared/sidebar')

const markdownToHtml = remark().use(remarkHTML).processSync
const is404Regexp = /^\/404/
const trailingSlashRegexp = /\/$/

const getNodeSlug = (node, getNode) => {
  // We need replace to fix paths for Windows
  const contentPath = path.join(process.cwd(), 'content').replace(/\\/g, '/')
  const source = node.fileAbsolutePath.replace(contentPath, '')
  let value

  if (source.startsWith('/blog')) {
    value = createFilePath({
      getNode,
      node,
      trailingSlash: false
    }).replace(/^\/blog\/[0-9\-]*/, '/blog/')

    // Convert fields in frontmatter from markdown to html
    const {
      frontmatter: { descriptionLong, pictureComment }
    } = node

    if (descriptionLong) {
      node.frontmatter.descriptionLong = markdownToHtml(
        descriptionLong
      ).contents
    }

    if (pictureComment) {
      node.frontmatter.pictureComment = markdownToHtml(pictureComment).contents
    }
    // end Convert fields
  } else {
    value = getItemBySource(source).path
  }

  return value
}

const setPageContext = (page, actions) => {
  actions.deletePage(page)
  actions.createPage({
    ...page,
    context: {
      ...page.context,
      is404: is404Regexp.test(page.path)
    }
  })
}

const removePageTrailingSlash = (page, actions) => {
  if (page.path !== '/' && trailingSlashRegexp.test(page.path)) {
    actions.deletePage(page)
    actions.createPage({
      ...page,
      path: page.path.replace(trailingSlashRegexp, '')
    })
  }
}

exports.getNodeSlug = getNodeSlug
exports.setPageContext = setPageContext
exports.removePageTrailingSlash = removePageTrailingSlash
