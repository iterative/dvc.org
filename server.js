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
     * HTTP redirects
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
      res.writeHead(303, {
        'Cache-Control': 'no-cache',
        Location: 'https://dvc.org/doc/command-reference' + pathname
      })
      res.end()
    } else if (/^(code|data|remote)\.dvc\.org$/.test(req.headers.host)) {
      // {code/data/remote}.dvc.org -> corresponding S3 bucket
      res.writeHead(303, {
        Location:
          'https://s3-us-east-2.amazonaws.com/dvc-public/' +
          req.headers.host.split('.')[0] +
          pathname
      })
      res.end()
    } else if (/^\/(deb|rpm)\/.*/i.test(pathname)) {
      // path /(deb|rpm)/... -> corresponding S3 bucket
      res.writeHead(303, {
        Location:
          'https://s3-us-east-2.amazonaws.com/dvc-s3-repo/' +
          pathname.substring(1)
      })
      res.end()
    } else if (/^\/(help|chat)\/?$/i.test(pathname)) {
      // path /(help|chat) -> Discord chat invite
      res.writeHead(303, { Location: 'https://discordapp.com/invite/dvwXA2N' })
      res.end()
    } else if (/^\/(docs|documentation)(\/.*)?$/i.test(pathname)) {
      // path /docs... or /documentation... -> /doc...
      res.writeHead(303, {
        Location: req.url.replace(/\/(docs|documentation)/i, '/doc')
      })
      res.end()
    } else if (/^\/doc\/commands-reference(\/.*)?$/i.test(pathname)) {
      // path /doc/commands-reference... -> /doc/command-reference...
      res.writeHead(303, {
        Location: req.url.replace(
          '/doc/commands-reference',
          '/doc/command-reference'
        )
      })
      res.end()
    } else if (/^\/doc\/tutorial\/?$/i.test(pathname)) {
      // path /doc/tutorial -> /doc/tutorials
      res.writeHead(303, {
        Location: req.url.replace(/\/doc\/tutorial\/?/, '/doc/tutorials')
      })
      res.end()
    } else if (/^\/doc\/tutorial\/(.*)?/.test(pathname)) {
      // path /doc/tutorial/... -> /doc/tutorials/deep/...
      res.writeHead(303, {
        Location: req.url.replace('/doc/tutorial/', '/doc/tutorials/deep/')
      })
      res.end()
    } else if (
      /^\/doc\/use-cases\/data-and-model-files-versioning\/?$/.test(pathname)
    ) {
      // path /doc/use-cases/data-and-model-files-versioning
      //  ->  /doc/use-cases/versioning-data-and-model-files
      res.writeHead(303, {
        Location: req.url.replace(
          '/doc/use-cases/data-and-model-files-versioning',
          '/doc/use-cases/versioning-data-and-model-files'
        )
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
