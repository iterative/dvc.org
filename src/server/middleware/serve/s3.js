'use strict'

/**
 * Middleware to serve static files from S3
 */

const fs = require('fs')
const url = require('url')
const path = require('path')
const mime = require('mime-types')
const Wreck = require('@hapi/wreck')
const { s3Url } = require('../../config')

const cacheControl = 'public, max-age=0, s-maxage=999999'
const htmlType = 'text/html; charset=utf-8'

let notFoundPage
try {
  // in production there's no public folder
  notFoundPage = fs.readFileSync(path.join(__dirname, '../../../../404.html'))
} catch (e) {
  notFoundPage = fs.readFileSync(
    path.join(__dirname, '../../../../public/404.html')
  )
}

async function serveFile(pathname, res) {
  const target = s3Url + pathname

  const proxyRes = await Wreck.request('GET', target, {
    redirects: 2,
    timeout: 5000
  })

  const { statusCode, headers: { etag } = {} } = proxyRes

  if (statusCode !== 200) {
    throw new Error('Response not successful: ' + statusCode)
  }

  res.writeHead(200, {
    'cache-control': cacheControl,
    'content-type': mime.lookup(pathname) || htmlType,
    etag
  })

  proxyRes.pipe(res)
}

module.exports = async (req, res) => {
  const { pathname } = url.parse(req.url)

  try {
    await serveFile(pathname, res)
  } catch (e) {
    res
      .writeHead(404, {
        'cache-control': cacheControl,
        'content-type': htmlType
      })
      .end(notFoundPage)
  }
}
