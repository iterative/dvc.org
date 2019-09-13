// This file doesn't go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the
// current node version you are running.
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal
// Webpack or universal Babel.

const { createServer } = require('http')
const { parse } = require('url')
const _ = require('force-ssl-heroku')
const next = require('next')
const querystring = require('querystring')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const port = process.env.PORT || 3000
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    // Special URL host redirects
    if (
      req.headers['host'].match(/^www/) !== null ||
      (req.headers['x-forwarded-proto'] !== 'https' && !dev)
    ) {
      res.writeHead(301, {
        Location:
          'https://' + req.headers['host'].replace(/^www\./, '') + req.url
      })
      res.end()
    } else if (req.headers.host === 'man.dvc.org') {
      let normalized_pathname =
        ['/get-url', '/import-url'].indexOf(pathname) > 0
          ? pathname.replace(/-/i, '/')
          : pathname
      const doc_pathname = '/doc/commands-reference' + normalized_pathname
      res.writeHead(301, { Location: 'https://dvc.org' + doc_pathname })
      res.end()
    } else if (/^(code|data|remote)\.dvc\.org$/.test(req.headers.host)) {
      res.writeHead(301, {
        Location:
          'https://s3-us-east-2.amazonaws.com/dvc-public/' +
          req.headers.host.split('.')[0] +
          pathname
      })
      res.end()

      // Special URL path redirects below
    } else if (/^\/doc.*/i.test(pathname)) {
      let normalized_pathname = pathname.replace(/^\/doc[^?\/]*/i, '/doc')
      if (normalized_pathname !== pathname) {
        res.writeHead(301, {
          Location:
            normalized_pathname +
            (Object.keys(query).length === 0 ? '' : '?') +
            querystring.stringify(query)
        })
        res.end()
      } else {
        app.render(req, res, '/doc', query)
      }
    } else if (/^\/(deb|rpm)\/.*/i.test(pathname)) {
      res.writeHead(301, {
        Location:
          'https://s3-us-east-2.amazonaws.com/dvc-s3-repo/' +
          pathname.substring(1)
      })
      res.end()
    } else if (/^\/(help|chat)\/?$/i.test(pathname)) {
      res.writeHead(301, { Location: 'https://discordapp.com/invite/dvwXA2N' })
      res.end()
    } else {
      handle(req, res, parsedUrl)
    }

    // Invokes server `createServer`
  }).listen(port, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
