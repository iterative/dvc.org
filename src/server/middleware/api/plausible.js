const { isProduction } = require('../../utils')
const NodeCache = require('node-cache')
require('isomorphic-fetch')

const ScriptName = '/pl/script.js'
const Endpoint = '/event'
const ScriptWithoutExtension = ScriptName.replace('.js', '')

const cache = new NodeCache({ stdTTL: 60 })

async function handlePlausibleScript(req, res) {
  try {
    const pathname = req.path
    const [baseUri, ...extensions] = pathname.split('.')

    if (baseUri.endsWith(ScriptWithoutExtension)) {
      const url = 'https://plausible.io/js/plausible.' + extensions.join('.')

      const cachedContent = cache.get(url)

      if (cachedContent !== undefined) {
        if (!isProduction) console.log(`Using cache for ${url}`)
        const cachedContentType = cache.get(url + 'content-type')
        if (cachedContentType) {
          res.set({ 'content-type': cachedContentType })
        }
        return res.status(200).send(cachedContent)
      }

      const response = await fetch(url)
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        const content = await response.text()

        cache.set(url, content)
        cache.set(url + 'content-type', contentType)

        res.set({ 'content-type': contentType })
        return res.status(200).send(content)
      } else {
        res.status(response.status).send(await response.text())
      }
    }
    res.status(404).end()
  } catch (error) {
    if (!isProduction) console.error(error)
    res.status(500).end()
  }
}
async function handlePlausibleRequest(req, res) {
  try {
    const pathname = req.path
    let { body } = req
    if (typeof body === 'object') {
      body = JSON.stringify(body)
    }
    if (pathname.endsWith(Endpoint)) {
      const response = await fetch('https://plausible.io/api/event', {
        method: req.method,
        body,
        headers: {
          'content-type': 'application/json'
        }
      })
      res.set({
        'content-type': response.headers.get('content-type')
      })
      return res.status(response.status).send(await response.text())
    }
    res.status(404).end()
  } catch (error) {
    if (!isProduction) console.error(error)
    res.status(500).end()
  }
}

module.exports = {
  handlePlausibleScript,
  handlePlausibleRequest
}
