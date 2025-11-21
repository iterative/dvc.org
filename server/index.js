/*
 * Production server.
 *
 * NOTE: This file doesn't go through babel or webpack. Make sure the syntax and
 * sources this file requires are compatible with the current node version you
 * are running.
 *
 * Required environment variables:
 *
 *  - HEROKU_APP_NAME: If this is a PR, an ID of the PR. Don't add this for
 *    production.
 */
require('./instrument')
require('dotenv').config()

const Sentry = require('@sentry/node')
const compression = require('compression')
const express = require('express')
const helmet = require('helmet')
const { createProxyMiddleware } = require('http-proxy-middleware')
const permissionsPolicy = require('permissions-policy')
const serveHandler = require('serve-handler')

const redirectsMiddleware = require('./redirect')

const port = process.env.PORT || 3000
const app = express()

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
      frameSrc: ['https://*.youtube.com', 'https://*.youtube-nocookie.com'],
      connectSrc: ["'self'", 'https:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      formAction: ["'self'", 'https://doc.dvc.org']
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

const mustRevalidate = 'public, max-age=0, must-revalidate'
const cacheForever = 'public, max-age=31536000, immutable'
const serveMiddleware = async (req, res) => {
  await serveHandler(req, res, {
    public: 'public',
    cleanUrls: true,
    trailingSlash: false,
    directoryListing: false,
    headers: [
      {
        source: '**/*.html',
        headers: [{ key: 'Cache-Control', value: mustRevalidate }]
      },
      {
        source: 'page-data/**',
        headers: [{ key: 'Cache-Control', value: mustRevalidate }]
      },
      {
        source: 'static/**',
        headers: [{ key: 'Cache-Control', value: cacheForever }]
      },
      {
        source: '**/*.@(css|js)',
        headers: [{ key: 'Cache-Control', value: cacheForever }]
      },
      {
        source: '**/*.@(jpg|jpeg|gif|png|svg)',
        headers: [{ key: 'Cache-Control', value: 'max-age=86400' }]
      }
    ]
  })
}
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
  console.log('Serving static files from local')
})
