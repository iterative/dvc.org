/* eslint-env node */

/*
 * Custom server (with custom routes) See
 * https://nextjs.org/docs/advanced-features/custom-server
 *
 * NOTE: This file doesn't go through babel or webpack. Make sure the syntax and
 * sources this file requires are compatible with the current node version you
 * are running.
 */

const { createServer } = require('http')
const { parse: parseURL } = require('url')
const { parse: parseQuery } = require('querystring')
const next = require('next')

const { getItemByPath } = require('./src/utils/sidebar')
const { getRedirect } = require('./src/utils/redirects')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

app.prepare().then(() => {
  createServer((req, res) => {
    let parsedUrl = parseURL(req.url)
    const { pathname, query: queryStr } = parsedUrl
    const host = req.headers.host

    let [redirectCode, redirectLocation] = getRedirect(host, pathname, {
      req,
      dev
    })
    if (redirectLocation) {
      // HTTP redirects

      if (queryStr) {
        redirectLocation += '?' + queryStr
      }
      res.writeHead(redirectCode, {
        'Cache-control': 'no-cache',
        Location: redirectLocation
      })
      res.end()
    } else if (/^\/doc(\/.*)?$/.test(pathname)) {
      // Docs Engine handler

      // Force 404 response code for any inexistent /doc item.
      if (!getItemByPath(pathname)) {
        res.statusCode = 404
      }

      // Custom route for all docs
      app.render(req, res, '/doc', parseQuery(queryStr))
    } else {
      // Regular Next.js handler

      if (null === parsedUrl.query) parsedUrl.query = {}
      handle(req, res, parsedUrl)
    }
  }).listen(port, err => {
    if (err) throw err
    console.info(`> Ready on localhost:${port}`)
  })
})
