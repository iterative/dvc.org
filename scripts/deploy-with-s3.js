#!/usr/bin/env node
'use strict'
require('dotenv').config()
const { rm, rename } = require('node:fs/promises')
const { exit } = require('node:process')
const path = require('path')

const { DEPLOY_OPTIONS } = process.env

const { s3Prefix } = require('../src/server/config')

// eslint-disable-next-line import-x/order
const clearCloudfrontCache = require('./clear-cloudfront-cache')
// Generate deploy options from a comma separated string in the DEPLOY_OPTIONS
// env var. If DEPLOY_OPTIONS isn't set, use a default setting.
const deployOptions = DEPLOY_OPTIONS
  ? DEPLOY_OPTIONS.split(',').reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: true
      }),
      {}
    )
  : {
      download: true,
      build: true,
      retry: true,
      upload: true,
      clean: true,
      clearCloudfrontCache: true
    }

if (deployOptions.logSteps) {
  // Log enabled steps in order.
  console.log(
    '---\nDeploy options: [' +
      ['download', 'build', 'upload', 'clean']
        .filter(step => deployOptions[step])
        .join(', ') +
      ']\n---'
  )
}

/**
 * Build gatsby site and deploy public/ to s3.
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
const publicDirName = 'public'

const { uploadToS3 } = require('./s3-utils')

async function main() {
  if (deployOptions.upload) {
    await uploadToS3(publicDirName, '/', s3Prefix)
    // Move the 404 HTML file from public into the root dir for Heroku
    await rename(
      path.join(rootDir, publicDirName, '404.html'),
      path.join(rootDir, '404.html')
    )
  }

  if (deployOptions.clean) {
    console.log('Cleaning all local cache!')
    await rm(path.join(rootDir, publicDirName), {
      recursive: true,
      force: true
    })
    await rm(path.join(rootDir, '.cache'), { recursive: true, force: true })
  }

  if (deployOptions.clearCloudfrontCache) {
    await clearCloudfrontCache()
  }
}

main().catch(e => {
  console.error(e)
  exit(1)
})
