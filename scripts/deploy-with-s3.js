#!/usr/bin/env node
'use strict'
require('dotenv').config()
const path = require('path')
const PRODUCTION_PREFIX = 'dvc-org-prod'

const crypto = require('crypto')

console.log(process.env.KEEP_GATSBY_DEPLOY_CACHE)

/**
 * Build gatsby site and deploy public/ to s3.
 *
 * The S3 path of the deployment depends on the HEROKU_APP_NAME variable,
 * which is passed to PRs by heroku, but you can set locally too.
 *
 * With HEROKU_APP_NAME: /dvc-org-pulls/$HEROKU_APP_NAME
 * Without HEROKU_APP_NAME: /dvc-org-prod
 *
 * Needs following environment variables:
 *
 *  - S3_BUCKET: name of the bucket
 *  - AWS_REGION: region of the bucket
 *  - AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY: auth token to access the bucket.
 *  - HEROKU_APP_NAME: (optional) app name to specify the ID of the PR if any.
 **/

const { execSync } = require('child_process')

const rootDir = process.cwd()
const publicDirName = 'public'
const cacheDirs = [
  [publicDirName, '/'],
  ['.cache', '-cache/']
]

const fs = require('fs')

const { s3Prefix, withEntries, prefixIsEmpty } = require('./s3-utils')
const { move } = require('fs-extra')
const { downloadAllFromS3, uploadAllToS3, cleanAllLocal } = withEntries(
  cacheDirs
)

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

  if (emptyPrefix) {
    console.warn(
      `The current prefix "${s3Prefix}" is empty! Attempting to fall back on production cache.`
    )
    //await downloadAllFromS3(PRODUCTION_PREFIX)
  } else {
    await downloadAllFromS3(s3Prefix)
  }

  /** Temporary debug cache logging */
  let imageCacheDir
  ;['/public', '/.cache'].forEach(x => {
    const localDir = rootDir + x
    try {
      const files = fs.readdirSync(localDir)
      // TODO Make this recurse
      const fileCount = files.length
      const md5 = crypto
        .createHash('md5')
        .update(JSON.stringify(files))
        .digest('hex')
      console.log(`${fileCount} files in ${localDir}\nHash: ${md5}`)
    } catch (e) {
      console.error("Couldn't list " + localDir)
    }
  })
  /** End debug cache logging */

  try {
    run('yarn build')
  } catch (buildError) {
    // Sometimes gatsby build fails because of bad cache.
    // Clear it and try again.

    console.error('------------------------\n\n')
    console.error('The first Gatsby build attempt failed!\n')
    console.error(buildError)
    console.error('\nRetrying with a cleared cache:\n')

    await cleanAllLocal()
    run('yarn build')
  }

  await uploadAllToS3(s3Prefix)

  // Move the 404 HTML file from public into the root dir for Heroku
  await move(
    path.join(rootDir, publicDirName, '404.html'),
    path.join(rootDir, '404.html'),
    {
      overwrite: true
    }
  )
  if (!process.env.KEEP_GATSBY_DEPLOY_CACHE) {
    console.log('Cleaning all local cache!')
    await cleanAllLocal()
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
