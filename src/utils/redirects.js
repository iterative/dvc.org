/* eslint-env node */

let redirects = require('../../redirects-list.json')

const processRedirectString = redirectString => {
  let [regex, replace, code = 301] = redirectString.split(/\s+/g)
  const matchPathname = /^\^?\//.test(regex)
  regex = new RegExp(regex)
  code = Number(code)
  return {
    regex,
    matchPathname,
    replace,
    code
  }
}

exports.processRedirectString = processRedirectString

// Parse redirects when starting up
redirects = redirects.map(processRedirectString)

const matchRedirectList = (host, pathname) => {
  const wholeUrl = `https://${host}${pathname}`

  for (const { matchPathname, regex, replace, code } of redirects) {
    const matchTarget = matchPathname ? pathname : wholeUrl
    if (regex.test(matchTarget)) {
      return [code, matchTarget.replace(regex, replace)]
    }
  }

  return []
}

const getRedirect = (host, pathname, { req, dev } = {}) => {
  if (req != null && req.headers['x-forwarded-proto'] !== 'https' && !dev) {
    return [301, `https://${host.replace(/^www\./, '')}${req.url}`]
  }

  return matchRedirectList(host, pathname)
}

exports.getRedirect = getRedirect
