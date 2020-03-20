/* eslint-env node */

const express = require('express')
const compression = require('compression')
const serveHandler = require('serve-handler')

const app = express()

const apiMiddleware = require('./middleware/api')
const redirectsMiddleware = require('./middleware/redirects')

const port = process.env.PORT || 3000

app.use(compression())
app.use(redirectsMiddleware)
app.use('/api', apiMiddleware)

app.use((req, res) => {
  serveHandler(req, res, {
    public: 'public',
    cleanUrls: true,
    trailingSlash: false,
    directoryListing: false,
    headers: [
      {
        source: '**/*.@(jpg|jpeg|gif|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=86400'
          }
        ]
      },
      {
        source: '!**/*.@(jpg|jpeg|gif|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=0'
          }
        ]
      }
    ]
  })
})

app.listen(port, () => console.log(`Ready on localhost:${port}!`))
