'use strict'

const path = require(`path`)

const { S3Client, HeadObjectCommand } = require(`@aws-sdk/client-s3`)
const { remove } = require(`fs-extra`)
const { S3SyncClient } = require(`s3-sync-client`)

const { s3Prefix, s3Bucket } = require(`../src/config`)

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

const rootDir = process.cwd()

function localPath(dirName) {
  return path.join(rootDir, dirName)
}

async function prefixIsEmpty(prefix = s3Prefix) {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: s3Bucket,
        Key: `${prefix}/index.html`
      })
    )
    return false
  } catch {
    return true
  }
}

async function downloadFromS3(dir, childPrefix, basePrefix = s3Prefix) {
  try {
    const prefix = basePrefix + childPrefix
    const s3FullPath = `s3://${s3Bucket}/${prefix}`

    console.log(`Syncing "${dir}" from ${s3FullPath}`)
    const timeString = `"${dir}" synced in`
    console.time(timeString)
    await sync(s3FullPath, localPath(dir), {
      del: true,
      // For some reason, the s3-sync-client creates full prefix paths when syncing from s3
      // https://github.com/jeanbmar/s3-sync-client/issues/64
      relocations: [key => key.replace(prefix, ``)]
    })
    console.timeEnd(timeString)
  } catch (downloadError) {
    console.error('Error downloading initial data', downloadError)
    // Don't propagate. It's just a cache warming step
  }
}

async function uploadToS3(dir, childPrefix, basePrefix = s3Prefix) {
  const prefix = basePrefix + childPrefix
  const s3FullPath = `s3://${s3Bucket}/${prefix}`
  console.log(`Syncing "${dir}" to ${s3FullPath}`)
  const timeString = `"${dir}" synced in`
  console.time(timeString)
  await sync(localPath(dir), s3FullPath, {
    del: true,
    // For some reason, the s3-sync-client add an extra `/` to the path when syncing to s3
    // https://github.com/jeanbmar/s3-sync-client/issues/64
    relocations: [path => path.replace(`//`, `/`)]
  })
  console.timeEnd(timeString)
}

async function cleanEntry([dir]) {
  return remove(localPath(dir))
}

async function cleanAllLocal(entries) {
  return Promise.all(entries.map(cleanEntry))
}

async function downloadAllFromS3(entries, basePrefix) {
  return Promise.all(
    entries.map(([dir, childPrefix]) =>
      downloadFromS3(dir, childPrefix, basePrefix)
    )
  )
}

async function uploadAllToS3(entries, basePrefix) {
  return Promise.all(
    entries.map(([dir, childPrefix]) =>
      uploadToS3(dir, childPrefix, basePrefix)
    )
  )
}

// Some syntax sugar that generates versions of the entry-based
// functions with an entries list baked in.
function withEntries(entries) {
  return {
    async downloadAllFromS3(basePrefix) {
      return downloadAllFromS3(entries, basePrefix)
    },
    async uploadAllToS3(basePrefix) {
      return uploadAllToS3(entries, basePrefix)
    },
    async cleanAllLocal() {
      return cleanAllLocal(entries)
    }
  }
}

module.exports = {
  s3Bucket,
  s3Prefix,
  s3Client,
  uploadAllToS3,
  downloadAllFromS3,
  withEntries,
  cleanEntry,
  cleanAllLocal,
  prefixIsEmpty
}
