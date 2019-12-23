/*
 * This API endpoint is used by our blog to get comments count for the post, it
 * gets discuss.dvc.org topic URL as a param and returns comments count or
 * error.
 *
 * It made this way to configure CORS, reduce user's payload and to add
 * potential ability to cache comments count in the future.
 */

import Cors from 'micro-cors'
import request from 'request'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 900 })

import { BLOG_URL, FORUM_URL } from '../../src/consts'

const cors = Cors({
  allowedMethods: ['GET', 'HEAD'],
  origin: BLOG_URL
})

const getCommentCount = (req, res) => {
  const {
    query: { url }
  } = req

  if (!url.startsWith(FORUM_URL)) {
    res.status(400)

    return
  }

  if (cache.get(url)) {
    console.log(`Using cache for ${url}`)
    res.status(200).json({ count: cache.get(url) })

    return
  }

  request(`${url}.json`, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      res.status(502).json({ error: 'Unexpected response from Forum' })

      return
    }

    const json = JSON.parse(body)

    if (!json.posts_count) {
      res.status(502).json({ error: 'Unexpected payload from Forum' })

      return
    }

    // post_count return all posts including topic itself
    const count = json.posts_count - 1

    console.log(`Not using cache for ${url}`)
    cache.set(url, count)

    res.status(200).json({ count })
  })
}

export default cors(getCommentCount)
