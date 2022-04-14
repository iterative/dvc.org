const { isProduction } = require('../../utils')

require('isomorphic-fetch')
const ScriptName = '/pl/script.js'
const Endpoint = '/event'

const ScriptWithoutExtension = ScriptName.replace('.js', '')

async function handlePlausibleScript(req, res) {
  try {
    const pathname = req.path
    const [baseUri, ...extensions] = pathname.split('.')

    if (baseUri.endsWith(ScriptWithoutExtension)) {
      const response = await fetch(
        'https://plausible.io/js/plausible.outbound-links.' +
          extensions.join('.')
      )
      res.set({
        'content-type': response.headers.get('content-type')
      })
      return response.body.pipe(res)
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
    if (pathname.endsWith(Endpoint)) {
      const response = await fetch('https://plausible.io/api/event', {
        method: req.method,
        body: JSON.stringify(req.body),
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
