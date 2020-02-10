/* eslint-env node */

const withSourceMaps = require('@zeit/next-source-maps')

const settings = withSourceMaps({
  webpack(config) {
    return config
  },
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN
  }
})

module.exports = settings
