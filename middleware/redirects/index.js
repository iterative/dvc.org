/* eslint-env node */

const { getRedirect } = require('../../src/utils/redirects')
const { parse } = require('url')
const { stringify } = require('querystring')

const dev = process.env.NODE_ENV !== 'production'

module.exports = (req, res, next) => {
  const parsedUrl = parse(req.url, true)
  const { pathname, query } = parsedUrl
  const host = req.headers.host

  let [redirectCode, redirectLocation] = getRedirect(host, pathname, {
    req,
    dev
  })

  if (redirectLocation) {
    // HTTP redirects

    const queryStr = stringify(query)
    if (queryStr) {
      redirectLocation += '?' + queryStr
    }
    res.writeHead(redirectCode, {
      Location: redirectLocation
    })

    res.end()

    return
  }

  next()
}
