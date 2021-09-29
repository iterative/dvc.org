const remark = require('remark')
const remarkHTML = require('remark-html')
const is404Regexp = /^\/404/
const isDocsRegexp = /^\/doc/

const alertLandingArray = ['/enterprise/']

const markdownProcessor = remark().use(remarkHTML).processSync
function markdownToHtml(input) {
  return markdownProcessor(input).contents
}

const setPageContext = (page, actions) => {
  const isAlertLanding = alertLandingArray.includes(page.path)

  actions.deletePage(page)
  actions.createPage({
    ...page,
    context: {
      ...page.context,
      is404: is404Regexp.test(page.path),
      isDocs: isDocsRegexp.test(page.path),
      isAlertLanding
    }
  })
}

exports.setPageContext = setPageContext
exports.markdownToHtml = markdownToHtml
