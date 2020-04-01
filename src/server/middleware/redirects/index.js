const { getRedirect } = require('../../../../src/utils/redirects')
const { parse } = require('url')
const { stringify } = require('querystring')
const { isProduction } = require('../../utils')

module.exports = (req, res, next) => {
  const parsedUrl = parse(req.url, true)
  const { pathname, query } = parsedUrl
  const host = req.headers.host

  const [code, location] = getRedirect(host, pathname, {
    req,
    dev: !isProduction
  })

  if (location) {
    // HTTP redirects
    let redirectLocation = location

    const queryStr = stringify(query)
    if (queryStr) {
      redirectLocation += '?' + queryStr
    }
    res.writeHead(code, {
      Location: redirectLocation
    })

    res.end()

    return
  }

  next()
}
