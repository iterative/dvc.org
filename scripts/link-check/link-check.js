const fetch = require('node-fetch')
const { isExcluded } = require('./exclusions.js')
const MAX_ATTEMPTS = 1
const ATTEMPT_RETRY_DELAY = 1000

const getURL = (link, baseURL) => {
  return new URL(
    /^(https?:\/)?\//.test(link) ? link : `https://${link}`,
    baseURL
  )
}

const fetchWithRetries = async (href, attempt = 1) => {
  const res = await fetch(href)
  if (res.status === 504) {
    if (attempt < MAX_ATTEMPTS) {
      return new Promise(resolve =>
        setTimeout(
          () => fetchWithRetries(href, attempt + 1).then(resolve),
          ATTEMPT_RETRY_DELAY
        )
      )
    } else {
      return res
    }
  } else {
    return res
  }
}

const memo = {}
const memoizedFetch = async href => {
  const existing = memo[href]
  if (existing) {
    return existing
  } else {
    memo[href] = fetchWithRetries(href)
    return memo[href]
  }
}

const buildLinkCheckObject = async (link, baseURL) => {
  if (isExcluded(link)) {
    return {
      link,
      result: 'excluded',
      ok: true
    }
  } else {
    const { href } = getURL(link, baseURL)
    const { status, ok } = await memoizedFetch(href)
    return {
      link,
      result: status,
      ok
    }
  }
}

module.exports = buildLinkCheckObject
