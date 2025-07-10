const Sentry = require('@sentry/node')

const { parseBoolean } = require('./utils')

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  debug: parseBoolean(process.env.SENTRY_DEBUG)
})
