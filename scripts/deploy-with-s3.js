#!/usr/bin/env node
'use strict'

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

const path = require('path')
const { execSync } = require('child_process')
const { remove, move, ensureDir } = require('fs-extra')
const { s3Prefix, s3Bucket, s3Client } = require('./s3-utils')

const rootDir = path.join(__dirname, '..')
const cacheDir = path.join(rootDir, '.cache')
const publicDir = path.join(rootDir, 'public')

function run(command) {
  execSync(command, {
    stdio: ['pipe', process.stdout, process.stderr]
  })
}

function syncCall(method, ...args) {
  return new Promise((resolve, reject) => {
    const synchroniser = s3Client[method](...args)
    synchroniser.on('error', reject)
    synchroniser.on('end', resolve)
  })
}

async function prefixIsEmpty(prefix) {
  try {
    await s3Client.s3
      .headObject({
        Bucket: s3Bucket,
        Prefix: prefix + '/index.html'
      })
      .promise()
    return false
  } catch (e) {
    return true
  }
}

async function downloadFromS3(prefix) {
  try {
    const staticDir = path.join(publicDir, 'static')
    const staticPrefix = prefix + '/static'
    await ensureDir(staticDir)

    console.log(
      `downloading public/static from s3://${s3Bucket}/${staticPrefix}`
    )
    console.time('download from s3')
    await syncCall('downloadDir', {
      localDir: staticDir,
      s3Params: {
        Bucket: s3Bucket,
        Prefix: staticPrefix
      }
    })
    console.timeEnd('download from s3')
  } catch (downloadError) {
    console.error('Error downloading initial data', downloadError)
    // Don't propagate. It's just a cache warming step
  }
}

async function uploadToS3() {
  console.log(`Uploading public/ to s3://${s3Bucket}/${s3Prefix}`)
  console.time('upload to s3')
  await syncCall('uploadDir', {
    localDir: publicDir,
    deleteRemoved: true,
    s3Params: {
      Bucket: s3Bucket,
      Prefix: s3Prefix
    }
  })
  console.timeEnd('upload to s3')
}

async function main() {
  const emptyPrefix = await prefixIsEmpty(s3Prefix)

  // First build of a PR is slow because it can't reuse cache.
  // But we can download from prod to warm cache up.
  const cacheWarmPrefix = emptyPrefix ? 'dvc-org-prod' : s3Prefix

  await downloadFromS3(cacheWarmPrefix)

  try {
    run('yarn build')
  } catch (buildError) {
    // Sometimes gatsby build fails because of bad cache.
    // Clear it and try again.

    console.error('------------------------\n\n')
    console.error(buildError)
    console.error('\nAssuming bad cache and retrying:\n')

    await remove(cacheDir)
    await remove(publicDir)
    run('yarn build')
  }

  await move(path.join(publicDir, '404.html'), path.join(rootDir, '404.html'), {
    overwrite: true
  })
  await uploadToS3()
  await remove(publicDir)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
