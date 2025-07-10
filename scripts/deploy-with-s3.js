#!/usr/bin/env node
'use strict'
require('dotenv').config()
const { execSync } = require('child_process')
const { mkdirSync } = require('fs')
const { exit } = require('node:process')
const path = require('path')

const { DEPLOY_OPTIONS, USE_PRODUCTION_CACHE } = process.env
const { move } = require('fs-extra')

const { productionPrefix, s3Prefix } = require('../src/server/config')

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
const cacheDirs = [
  [publicDirName, '/'],
  ['.cache', '-cache/']
]

const { withEntries, prefixIsEmpty, cleanEntry } = require('./s3-utils')
const { downloadAllFromS3, uploadAllToS3, cleanAllLocal } =
  withEntries(cacheDirs)

function run(command) {
  execSync(command, {
    stdio: ['pipe', process.stdout, process.stderr]
  })
}

async function main() {
  // Check if the prefix we're working with has a build in it.
  const emptyPrefix = await prefixIsEmpty()
  // If not, we download production's cache.
  // This greatly speeds up PR initial build time.

  if (deployOptions.download) {
    if (USE_PRODUCTION_CACHE) {
      console.warn('USE_PRODUCTION_CACHE is set, downloading from production')
      await downloadAllFromS3(productionPrefix)
    } else if (emptyPrefix) {
      console.warn(
        `The current prefix "${s3Prefix}" is empty! Attempting to fall back on production cache.`
      )
      await downloadAllFromS3(productionPrefix)
    } else {
      await downloadAllFromS3(s3Prefix)
    }
    mkdirSync('.cache/json', { recursive: true })
  }

  if (deployOptions.build) {
    try {
      run('yarn build')
    } catch (buildError) {
      if (deployOptions.retry) {
        // Sometimes gatsby build fails because of bad cache.
        // Clear it and try again.

        console.error('------------------------\n\n')
        console.error('The first Gatsby build attempt failed!\n')
        console.error(buildError)
        console.error('\nRetrying with a cleared cache:\n')

        // Clear only .cache so we re-use images
        await cleanEntry(cacheDirs[1])

        run('yarn build')
      } else {
        throw new Error(
          'The first Gatsby build attempt failed, and DEPLOY_OPTIONS does not include "retry"'
        )
      }
    }
  }

  if (deployOptions.upload) {
    await uploadAllToS3(s3Prefix)
    // Move the 404 HTML file from public into the root dir for Heroku
    await move(
      path.join(rootDir, publicDirName, '404.html'),
      path.join(rootDir, '404.html'),
      {
        overwrite: true
      }
    )
  }

  if (deployOptions.clean) {
    console.log('Cleaning all local cache!')
    await cleanAllLocal()
  }

  if (deployOptions.clearCloudfrontCache) {
    await clearCloudfrontCache()
  }
}

main().catch(e => {
  console.error(e)
  exit(1)
})
