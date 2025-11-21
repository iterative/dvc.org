#!/usr/bin/env node
'use strict'

require('dotenv').config()
const { rm, rename } = require('node:fs/promises')
const { exit } = require('node:process')
const path = require('path')

const { s3Prefix } = require('../src/server/config')

const clearCloudfrontCache = require('./clear-cloudfront-cache')
const { uploadToS3 } = require('./s3-utils')

const rootDir = process.cwd()
const publicDir = path.join(rootDir, 'public')
const cacheDir = path.join(rootDir, '.cache')

/**
 * Deploy public/ to s3.
 *
 * The S3 path of the deployment depends on the HEROKU_APP_NAME variable,
 * which is passed to PRs by heroku, but you can set locally too.
 *
 * With HEROKU_APP_NAME: /website-prefix-pulls/$HEROKU_APP_NAME
 * Without HEROKU_APP_NAME: /website-prefix-prod
 *
 * Needs following environment variables:
 *
 *  - S3_BUCKET: name of the bucket
 *  - AWS_REGION: region of the bucket
 *  - AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY: auth token to access the bucket.
 *  - HEROKU_APP_NAME: (optional) app name to specify the ID of the PR if any.
 **/
async function main() {
  await uploadToS3(publicDir, '/', s3Prefix)
  // Move the 404 HTML file from public into the root dir for Heroku
  await rename(path.join(publicDir, '404.html'), '404.html')
  // await rm(publicDir, { recursive: true, force: true })
  await rm(cacheDir, { recursive: true, force: true })
  await clearCloudfrontCache()
}

main().catch(e => {
  console.error(e)
  exit(1)
})
