/* eslint-env node */

// This file doesn't go through babel or webpack transformation. Make sure the
// syntax and sources this file requires are compatible with the current Node.js
// version you are running. (See https://github.com/zeit/next.js/issues/1245 for
// discussions on universal Webpack vs universal Babel.)

const { createServer } = require('http')
const next = require('next')
const { parse } = require('url')
const querystring = require('querystring')
const { getItemByPath } = require('./src/utils/sidebar')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    // Special URL redirects:
    if (
      (req.headers['x-forwarded-proto'] !== 'https' && !dev) ||
      req.headers.host.match(/^www/) !== null
    ) {
      // Enforce https protocol and remove www from host.
      res.writeHead(301, {
        Location: 'https://' + req.headers.host.replace(/^www\./, '') + req.url
      })
      res.end()
    } else if (req.headers.host === 'man.dvc.org') {
      // man.dvc.org/{cmd} -> dvc.org/doc/command-reference/{cmd},
      // replace - for / in {cmd} except for /get-url, /import-url
      res.writeHead(301, {
        'Cache-Control': 'no-cache',
        Location:
          'https://dvc.org/doc/command-reference' +
          (['/get-url', '/import-url'].indexOf(pathname) < 0
            ? pathname.replace('-', '/')
            : pathname)
      })
      res.end()
    } else if (/^(code|data|remote)\.dvc\.org$/.test(req.headers.host)) {
      // {code/data/remote}.dvc.org -> corresponding S3 bucket
      res.writeHead(301, {
        Location:
          'https://s3-us-east-2.amazonaws.com/dvc-public/' +
          req.headers.host.split('.')[0] +
          pathname
      })
      res.end()
    } else if (/^\/(deb|rpm)\/.*/i.test(pathname)) {
      // path /(deb|rpm) -> corresponding S3 bucket
      res.writeHead(301, {
        Location:
          'https://s3-us-east-2.amazonaws.com/dvc-s3-repo/' +
          pathname.substring(1)
      })
      res.end()
    } else if (/^\/(help|chat)\/?$/i.test(pathname)) {
      // path /(help|chat) -> Discord chat invite
      res.writeHead(301, { Location: 'https://discordapp.com/invite/dvwXA2N' })
      res.end()
    } else if (/^\/doc\/commands-reference(\/.*)?/.test(pathname)) {
      // path /doc/commands-reference... -> /doc/command-reference...
      res.writeHead(301, {
        Location: req.url.replace('commands-reference', 'command-reference')
      })
      res.end()
    } else if (/^\/doc\/tutorial\/(.*)?/.test(pathname)) {
      // path /doc/tutorial/... -> /doc/tutorials/deep/...
      res.writeHead(301, {
        Location: req.url.replace('/doc/tutorial/', '/doc/tutorials/deep/')
      })
      res.end()
    } else if (pathname === '/doc/tutorial' || pathname === '/doc/tutorial/') {
      // path /doc/tutorial -> /doc/tutorials
      res.writeHead(301, {
        Location: req.url.replace('/doc/tutorial', '/doc/tutorials')
      })
      res.end()
    } else if (
      pathname === '/doc/use-cases/data-and-model-files-versioning' ||
      pathname === '/doc/use-cases/data-and-model-files-versioning/'
    ) {
      // path /doc/use-cases/data-and-model-files-versioning
      //  ->  /doc/use-cases/versioning-data-and-model-files
      res.writeHead(301, {
        Location: req.url.replace(
          'data-and-model-files-versioning',
          'versioning-data-and-model-files'
        )
      })
      res.end()
    } else if (/^\/doc(?!s\/).*/i.test(pathname)) {
      // path /doc*/... -> /doc/... except for /docs/* (static .md files)
      let normalized_pathname = pathname.replace(/^\/doc[^?/]*/i, '/doc')
      if (normalized_pathname !== pathname) {
        res.writeHead(301, {
          Location:
            normalized_pathname +
            (Object.keys(query).length === 0 ? '' : '?') +
            querystring.stringify(query)
        })
        res.end()
      } else {
        // Force 404 response for inexistent /doc/... sidebar items.
        if (!getItemByPath(pathname)) {
          res.statusCode = 404
        }

        app.render(req, res, '/doc', query)
      }
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(port, err => {
    // Invokes `createServer` server.
    if (err) throw err
    console.info(`> Ready on localhost:${port}`)
  })
})
