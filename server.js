/* eslint-env node */

// This file doesn't go through babel or webpack transformation. Make sure the
// syntax and sources this file requires are compatible with the current Node.js
// version you are running. (See https://github.com/zeit/next.js/issues/1245 for
// discussions on universal Webpack vs universal Babel.)

const { createServer } = require('http')
const next = require('next')
const { parse } = require('url')
const { getItemByPath } = require('./src/utils/sidebar')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    /*
     * Special URL redirects.
     * NOTE: The order of the redirects is important.
     */
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
      res.writeHead(301, {
        'Cache-Control': 'no-cache',
        Location:
          'https://dvc.org/doc/command-reference' +
          // replace - for / in {cmd} except for get-url, import-url
          (['/get-url', '/import-url'].indexOf(pathname) < 0
            ? pathname.replace('-', '/')
            : pathname)
      })
      res.end()
    } else if (req.headers.host === 'err.dvc.org') {
      // err.dvc.org/{hdr} -> dvc.org/doc/user-guide/troubleshooting#{hdr},
      res.writeHead(301, {
        'Cache-Control': 'no-cache',
        Location: `https://dvc.org/doc/user-guide/troubleshooting#${pathname}`
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
      // path /(deb|rpm)/... -> corresponding S3 bucket
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
    } else if (/^\/(docs|documentation)(\/.*)?$/i.test(pathname)) {
      // path /docs... or /documentation... -> /doc...
      res.writeHead(301, {
        Location: req.url.replace(/\/(docs|documentation)/i, '/doc')
      })
      res.end()
    } else if (/^\/doc\/commands-reference(\/.*)?$/i.test(pathname)) {
      // path /doc/commands-reference... -> /doc/command-reference...
      res.writeHead(301, {
        Location: req.url.replace(
          '/doc/commands-reference',
          '/doc/command-reference'
        )
      })
      res.end()
    } else if (/^\/doc\/tutorial\/?$/i.test(pathname)) {
      // path /doc/tutorial -> /doc/tutorials
      res.writeHead(301, {
        Location: req.url.replace(/\/doc\/tutorial\/?/, '/doc/tutorials')
      })
      res.end()
    } else if (/^\/doc\/tutorial\/(.*)?/.test(pathname)) {
      // path /doc/tutorial/... -> /doc/tutorials/deep/...
      res.writeHead(301, {
        Location: req.url.replace('/doc/tutorial/', '/doc/tutorials/deep/')
      })
      res.end()
    } else if (
      /^\/doc\/use-cases\/data-and-model-files-versioning\/?$/.test(pathname)
    ) {
      // path /doc/use-cases/data-and-model-files-versioning
      //  ->  /doc/use-cases/versioning-data-and-model-files
      res.writeHead(301, {
        Location: req.url.replace(
          '/doc/use-cases/data-and-model-files-versioning',
          '/doc/use-cases/versioning-data-and-model-files'
        )
      })
      res.end()
    } else if (/^\/doc(\/.*)?$/.test(pathname)) {
      /*
       * Special Docs Engine handler
       */

      // Force 404 response for any inexistent /doc item.
      if (!getItemByPath(pathname)) {
        res.statusCode = 404
      }

      // Fire up docs engine!
      app.render(req, res, '/doc', query)
    } else {
      // Regular Next handler
      handle(req, res, parsedUrl)
    }
  }).listen(port, err => {
    // Invokes `createServer` server.
    if (err) throw err
    console.info(`> Ready on localhost:${port}`)
  })
})
