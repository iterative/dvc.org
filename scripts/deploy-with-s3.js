#!/usr/bin/env node
'use strict'

require('dotenv').config()
const { exit } = require('node:process')
const path = require('path')

const { uploadToS3, s3Prefix } = require('./s3-utils')

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
const rootDir = process.cwd()
const publicDir = path.join(rootDir, 'public')
uploadToS3(publicDir, '/', s3Prefix).catch(e => {
  console.error(e)
  exit(1)
})
