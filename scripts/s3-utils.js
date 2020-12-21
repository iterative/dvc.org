'use strict'

const path = require('path')
const s3 = require('s3-client')
const { s3Prefix, s3Bucket } = require('../src/server/config')
const { remove, ensureDir } = require('fs-extra')

const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  HEROKU_APP_NAME
} = process.env

const s3Client = s3.createClient({
  maxAsyncS3: 50,
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
})

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

function syncCall(method, ...args) {
  return new Promise((resolve, reject) => {
    const synchroniser = s3Client[method](...args)
    synchroniser.on('error', reject)
    synchroniser.on('end', resolve)
  })
}

async function prefixIsEmpty(prefix = s3Prefix) {
  try {
    await s3Client.s3
      .headObject({
        Bucket: s3Bucket,
        Key: `${prefix}/index.html`
      })
      .promise()
    return false
  } catch (e) {
    return true
  }
}

async function downloadFromS3(dir, childPrefix, basePrefix = s3Prefix) {
  try {
    const prefix = basePrefix + childPrefix
    const localDirPath = localPath(dir)
    await ensureDir(localDirPath)

    console.log(`Downloading "${dir}" from s3://${s3Bucket}/${prefix}`)
    const timeString = `"${dir}" downloaded in`
    console.time(timeString)
    await syncCall('downloadDir', {
      localDir: localDirPath,
      s3Params: {
        Bucket: s3Bucket,
        Prefix: prefix
      }
    })
    console.timeEnd(timeString)
  } catch (downloadError) {
    console.error('Error downloading initial data', downloadError)
    // Don't propagate. It's just a cache warming step
  }
}

async function uploadToS3(dir, childPrefix, basePrefix = s3Prefix) {
  const prefix = basePrefix + childPrefix
  console.log(`Uploading "${dir}" to s3://${s3Bucket}/${prefix}`)
  const timeString = `"${dir}" uploaded in`
  console.time(timeString)
  await syncCall('uploadDir', {
    localDir: localPath(dir),
    deleteRemoved: true,
    s3Params: {
      Bucket: s3Bucket,
      Prefix: prefix
    }
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
