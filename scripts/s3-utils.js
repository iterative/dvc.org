'use strict'

const { S3Client } = require('@aws-sdk/client-s3')
const { S3SyncClient } = require('s3-sync-client')

const { s3Prefix, s3Bucket } = require('../src/server/config')

const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  HEROKU_APP_NAME
} = process.env

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
})

const { sync } = new S3SyncClient({ client: s3Client })

console.log({
  AWS_REGION,
  HEROKU_APP_NAME,
  s3Bucket,
  s3Prefix,
  hasCreds: Boolean(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY)
})

async function uploadToS3(dir, childPrefix, basePrefix = s3Prefix) {
  const prefix = basePrefix + childPrefix
  const s3FullPath = `s3://${s3Bucket}/${prefix}`
  console.log(`Syncing "${dir}" to ${s3FullPath}`)
  const timeString = `"${dir}" synced in`
  console.time(timeString)
  await sync(dir, s3FullPath, {
    del: true,
    // For some reason, the s3-sync-client add an extra `/` to the path when syncing to s3
    // https://github.com/jeanbmar/s3-sync-client/issues/64
    relocations: [path => path.replace(`//`, `/`)]
  })
  console.timeEnd(timeString)
}

module.exports = {
  s3Prefix,
  uploadToS3
}
