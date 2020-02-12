/* eslint-env node */

/*
 * This API endpoint is used by our blog to get comments count for the post, it
 * gets discuss.dvc.org topic URL as a param and returns comments count or
 * error.
 *
 * It made this way to configure CORS, reduce user's payload and to add
 * potential ability to cache comments count in the future.
 */

import fetch from 'isomorphic-fetch'
import Cors from 'micro-cors'
import NodeCache from 'node-cache'

import { BLOG_URL, FORUM_URL } from '../../src/consts'

const cache = new NodeCache({ stdTTL: 900 })

const cors = Cors({
  allowedMethods: ['GET', 'HEAD'],
  origin: BLOG_URL
})

const getCommentCount = async (req, res) => {
  const {
    query: { url }
  } = req

  if (!url.startsWith(FORUM_URL)) {
    res.status(400)

    return
  }

  if (cache.get(url) !== undefined) {
    console.log(`Using cache for ${url}`)

    res.status(200).json({ count: cache.get(url) })

    return
  } else {
    console.log(`Not using cache for ${url}`)
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

export default cors(getCommentCount)
