/*
 * Production server. Proxies to S3 depending on HEROKU_APP_NAME (see
 * scripts/deploy-with-s3.js)
 *
 * NOTE: This file doesn't go through babel or webpack. Make sure the syntax and
 * sources this file requires are compatible with the current node version you
 * are running.
 *
 * Required environment variables:
 *
 *  - S3_BUCKET: name of the bucket
 *  - AWS_REGION: region of the bucket
 *  - AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY: IAM token to access bucket
 *  - HEROKU_APP_NAME: If this is a PR, an ID of the PR. Don't add this for
 *    production.
 */

require('./instrument')

const Sentry = require('@sentry/node')
const compression = require('compression')
const express = require('express')
const helmet = require('helmet')
const { createProxyMiddleware } = require('http-proxy-middleware')
const permissionsPolicy = require('permissions-policy')

require('dotenv').config()

// eslint-disable-next-line import-x/order
const { s3Url } = require('./config')

const port = process.env.PORT || 3000
const app = express()

const redirectsMiddleware = require('./middleware/redirects')
const serveMiddleware = require('./middleware/serve')
const { isProduction } = require('./utils')

app.use(compression())
app.use(redirectsMiddleware)
app.use(
  '/pl',
  createProxyMiddleware({
    target: 'https://plausible.io',
    changeOrigin: true,
    xfwd: true,
    pathRewrite: (path, _req) => path.replace(/^\/pl/, '')
  })
)
app.use(express.json())

// we can also extend to add further custom routes
app.get('/api/status', (req, res) => {
  res.send('ok')
})

const helmetOptions = {
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  },
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https:'],
      frameSrc: [
        'https://giphy.com',
        'https://platform.twitter.com',
        'https://*.youtube.com',
        'https://*.youtube-nocookie.com',
        'https://*.clickagy.com',
        'https://*.hubspot.com',
        'https://forms.hsforms.com',
        'https://embed.testimonial.to',
        'https://discordapp.com',
        'https://discord.com'
      ],
      connectSrc: ["'self'", 'https:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      formAction: ["'self'", 'https://forms.hsforms.com', 'https://dvc.org'],
      mediaSrc: ['https://static.iterative.ai']
    }
  }
}
app.use(
  permissionsPolicy({
    features: {
      fullscreen: [
        'self',
        '"https://*.youtube.com"',
        '"https://*.youtube-nocookie.com"'
      ],
      encryptedMedia: [
        'self',
        '"https://*.youtube.com"',
        '"https://*.youtube-nocookie.com"'
      ],
      autoplay: [
        'self',
        '"https://*.youtube.com"',
        '"https://*.youtube-nocookie.com"'
      ],
      webShare: ['self'],
      clipboardWrite: ['self']
    }
  })
)
app.use(helmet(helmetOptions))
app.use(serveMiddleware)
Sentry.setupExpressErrorHandler(app)

// Error handler
app.use(function onError(err, req, res, _next) {
  console.error(err)

  const status = err?.status || 500

  res.status(status).json({
    traceId: res.sentry,
    message: status === 500 ? 'Internal server error' : err.message
  })
})

// 404 error handler

app.use((req, res, _next) => {
  res.status(404).json({
    message: `${req.method} ${req.url} not found`
  })
})
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`)

  if (isProduction) {
    console.log(`Proxying to ${s3Url}`)
  } else {
    console.log('Serving static files from local')
  }
})
