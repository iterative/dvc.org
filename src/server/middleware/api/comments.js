/*
 * This API endpoint is used by our blog to get comments count for the post, it
 * gets discuss.dvc.org topic URL as a param and returns comments count or
 * error.
 *
 * It made this way to configure CORS, reduce user's payload and to add
 * potential ability to cache comments count in the future.
 */

const fetch = require('isomorphic-fetch')
const NodeCache = require('node-cache')
const { isProduction } = require('../../utils')

const { FORUM_URL } = require('../../../../src/consts')

const cache = new NodeCache({ stdTTL: 60 })

const getCommentCount = async (req, res) => {
  const {
    query: { url }
  } = req

  if (!url.startsWith(FORUM_URL)) {
    res.status(400)

    return
  }

  if (cache.get(url) !== undefined) {
    if (!isProduction) console.log(`Using cache for ${url}`)

    res.status(200).json({ count: cache.get(url) })

    return
  } else {
    if (!isProduction) console.log(`Not using cache for ${url}`)
  }

  try {
    const response = await fetch(`${url}.json`)

    if (response.status !== 200) {
      res.status(502).json({ error: 'Unexpected response from Forum' })

      return
    }

    const data = await response.json()

    if (!data.posts_count) {
      res.status(502).json({ error: 'Unexpected payload from Forum' })

      return
    }

    // post_count return all posts including topic itself
    const count = data.posts_count - 1

    cache.set(url, count)

    res.status(200).json({ count })
  } catch {
    res.status(404)
  }
}

module.exports = getCommentCount
