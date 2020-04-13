const path = require('path')
const process = require('process')
const { createFilePath } = require('gatsby-source-filesystem')
const remark = require('remark')
const remarkHTML = require('remark-html')
const { getItemBySource } = require('../utils/shared/sidebar')

const markdownToHtml = remark().use(remarkHTML).processSync
const is404Regexp = /^\/404/
const trailingSlashRegexp = /\/$/

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

exports.setPageContext = setPageContext
exports.removePageTrailingSlash = removePageTrailingSlash
