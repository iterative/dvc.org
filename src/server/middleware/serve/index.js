const { isProduction } = require('../../utils')
const localServeMiddleware = require('./local')
const s3ServeMiddleware = require('./s3')

module.exports = isProduction ? s3ServeMiddleware : localServeMiddleware
