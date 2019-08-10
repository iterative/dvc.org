// This file doesn't go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the
// current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal
// Webpack or universal Babel
const { createServer } = require('http')
const { parse } = require('url')
const _ = require('force-ssl-heroku')
const next = require('next')
const querystring = require('querystring')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl
    const doc = /^\/doc.*/i
    const s3 = /^\/s3\/.*/i
    const pkg = /^\/(deb|rpm)\/.*/i
    const chat = /^\/(help|chat)\/?$/i

    if (req.headers.host === 'man.dvc.org') {
      let normalized_pathname =
        pathname !== '/import-url' ? pathname.replace(/-/i, '/') : pathname
      const doc_pathname = '/doc/commands-reference' + normalized_pathname
      res.writeHead(301, { Location: 'https://dvc.org' + doc_pathname })
      res.end()
    } else if (req.headers.host === 'pycon2019.dvc.org') {
      res.writeHead(301, { Location: 'https://dvc.org/doc/get-started' })
      res.end()
    } else if (req.headers.host === 'remote.dvc.org') {
      res.writeHead(301, {
        Location: 'https://s3-us-west-2.amazonaws.com/dvc-storage' + pathname
      })
      res.end()
    } else if (doc.test(pathname)) {
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
    } else if (s3.test(pathname)) {
      res.writeHead(301, {
        Location:
          'https://s3-us-west-2.amazonaws.com/dvc-share/' +
          pathname.substring(4)
      })
      res.end()
    } else if (pkg.test(pathname)) {
      res.writeHead(301, {
        Location:
          'https://s3-us-east-2.amazonaws.com/dvc-s3-repo/' +
          pathname.substring(1, 4) +
          '/' +
          pathname.substring(5)
      })
      res.end()
    } else if (chat.test(pathname)) {
      res.writeHead(301, { Location: 'https://discordapp.com/invite/dvwXA2N' })
      res.end()
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(port, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
