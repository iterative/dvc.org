'use strict'

const { parseBoolean } = require('./utils')

const {
  AWS_REGION,
  S3_BUCKET,
  HEROKU_APP_NAME,
  WEBSITE_HOST,
  WEBSITE_HOST_PATH,
  SENTRY_DSN,
  SENTRY_DEBUG
} = process.env

const websiteHost = WEBSITE_HOST

const websiteHostPath = WEBSITE_HOST_PATH
  ? WEBSITE_HOST_PATH
  : String(websiteHost).split('.').join('-')

const stagingPrefix = `${websiteHostPath}-pulls/${HEROKU_APP_NAME}`
const productionPrefix = `${websiteHostPath}-prod`

const s3Prefix = HEROKU_APP_NAME ? stagingPrefix : productionPrefix

const s3Bucket = S3_BUCKET

const s3Url = `http://${s3Bucket}.s3-website.${AWS_REGION}.amazonaws.com/${s3Prefix}`

const forumUrl = `https://discuss.dvc.org`

const sentryDsn = SENTRY_DSN
const sentryDebug = parseBoolean(SENTRY_DEBUG)

module.exports = {
  s3Prefix,
  s3Bucket,
  s3Url,
  websiteHost,
  productionPrefix,
  forumUrl,
  sentryDsn,
  sentryDebug
}
