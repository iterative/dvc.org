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
const redirects = require('./src/redirects.json')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

// Generating the RegExp objects once is faster than generating
// them on the fly and throwing them away.
redirects.forEach(redirect => {
  redirect.regexObject = new RegExp(redirect.regex)
})

const matchRedirectList = (host, pathname) => {
  const wholeUrl = `https://${host}${pathname}`

  for (const { match, regexObject, replace, permanent } of redirects) {
    const matchTarget = match === 'url' ? wholeUrl : pathname
    if (regexObject.test(matchTarget)) {
      const code = permanent ? 301 : 303
      return [code, matchTarget.replace(regexObject, replace)]
    }
  }

  return []
}

const getRedirect = (req, host, pathname) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && !dev) {
    return [301, `https://${host.replace(/^www\./, '')}${req.url}`]
  }

  return matchRedirectList(host, pathname)
}

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl
    const host = req.headers.host

    /*
     * HTTP redirects
     */
    let [redirectCode, redirectLocation] = getRedirect(req, host, pathname)

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
