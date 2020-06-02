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

const express = require('express')
const compression = require('compression')
const { s3Url } = require('./config')
const { isProduction } = require('./utils')
require('dotenv').config()

const port = process.env.PORT || 3000
const app = express()

const apiMiddleware = require('./middleware/api')
const redirectsMiddleware = require('./middleware/redirects')
const serveMiddleware = require('./middleware/serve')

app.use(compression())
app.use(redirectsMiddleware)
app.use('/api', apiMiddleware)
app.use(serveMiddleware)

app.listen(port, () => {
  console.log(`Listening on http://0.0.0.0:${port}/`)

  if (isProduction) {
    console.log(`Proxying to ${s3Url}`)
  } else {
    console.log('Serving static files from local')
  }
})
