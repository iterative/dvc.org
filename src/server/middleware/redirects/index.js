const { stringify } = require('querystring')

const {
  getRedirect
} = require('@dvcorg/gatsby-theme/src/utils/shared/redirects')

const { isProduction } = require('../../utils')

const OLD_BLOG_URL_REGEXP = /dataversioncontrol\.com/

module.exports = (req, res, next) => {
  const host = req.headers.host
  let pathname = req.baseUrl + req.path
  // Remove invisible emoji from URL. It's was an old medium blog
  if (OLD_BLOG_URL_REGEXP.test(host)) {
    pathname = pathname.replace(/%EF%B8%8F/, '')
  }

  const [code, location] = getRedirect(host, pathname, {
    req,
    dev: !isProduction
  })

  // Disable trailing slash redirect for development mode.
  // Because it leads to infinite loops as Gatsby in dev mode redirects to urls with trailing slashes
  if (
    !isProduction &&
    location &&
    location.startsWith('/') &&
    pathname === `${location}/`
  ) {
    return next()
  }

  if (location) {
    // HTTP redirects
    let redirectLocation = location

    const queryStr = stringify(req.query)
    if (queryStr) {
      redirectLocation += '?' + queryStr
    }

    return res.redirect(code, redirectLocation)
  }

  next()
}
