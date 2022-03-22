const is404Regexp = /^\/404/
const isDocsRegexp = /^\/doc/
const trailingSlashRegexp = /\/$/

const alertLandingArray = ['/enterprise']

let markdownProcessor
const getMarkdownProcessor = async () => {
  if (!markdownProcessor) {
    const { remark } = await import('remark')
    const { default: remarkHTML } = await import('remark-html')
    markdownProcessor = remark().use(remarkHTML).processSync
  }
  return markdownProcessor
}

async function markdownToHtml(input) {
  return (await getMarkdownProcessor())(input).toString()
}

const setPageContext = (page, actions) =>
  new Promise(resolve => {
    const pagePath =
      page.path !== '/' && trailingSlashRegexp.test(page.path)
        ? page.path.replace(trailingSlashRegexp, '')
        : page.path

    const isAlertLanding = alertLandingArray.includes(pagePath)

    actions.deletePage(page)
    actions.createPage({
      ...page,
      path: pagePath,
      context: {
        ...page.context,
        is404: is404Regexp.test(page.path),
        isDocs: isDocsRegexp.test(page.path),
        isAlertLanding
      }
    })
    resolve()
  })

exports.setPageContext = setPageContext
exports.markdownToHtml = markdownToHtml
