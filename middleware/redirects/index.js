/* eslint-env node */

const { getRedirect } = require('../../src/utils/redirects')
const { parse } = require('url')
const { stringify } = require('querystring')

const dev = process.env.NODE_ENV !== 'production'

module.exports = (req, res, next) => {
  const parsedUrl = parse(req.url, true)
  const { pathname, query } = parsedUrl
  const host = req.headers.host

  const redirect = getRedirect(host, pathname, {
    req,
    dev
  })

  if (redirect.redirectLocation) {
    // HTTP redirects
    let redirectLocation = redirect.redirectLocation

    const queryStr = stringify(query)
    if (queryStr) {
      redirectLocation += '?' + queryStr
    }
    res.writeHead(redirect.redirectCode, {
      Location: redirectLocation
    })

    res.end()

    return
  }

  next()
}
