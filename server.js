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
const { parse } = require('url')
const next = require('next')

const { getItemByPath } = require('./src/utils/sidebar')
const { getRedirect } = require('./src/redirects.js')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

// Do not run the server if the module is being required by something else
if (module.parent == null) {
  app.prepare().then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl
      const host = req.headers.host

      /*
       * HTTP redirects
       */
      let [redirectCode, redirectLocation] = getRedirect(host, pathname, {
        req,
        dev
      })

      if (redirectLocation) {
        // should be getting the query as a string
        const { query } = parse(req.url)
        if (query) {
          redirectLocation += '?' + query
        }
        res.writeHead(redirectCode, {
          'Cache-control': 'no-cache',
          Location: redirectLocation
        })
        res.end()
      } else if (/^\/doc(\/.*)?$/.test(pathname)) {
        /*
         * Docs Engine handler
         */

        // Force 404 response code for any inexistent /doc item.
        if (!getItemByPath(pathname)) {
          res.statusCode = 404
        }

        // Custom route for all docs
        app.render(req, res, '/doc', query)
      } else {
        // Regular Next.js handler
        handle(req, res, parsedUrl)
      }
    }).listen(port, err => {
      if (err) throw err
      console.info(`> Ready on localhost:${port}`)
    })
  })
}
