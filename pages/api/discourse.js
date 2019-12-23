/* eslint-env node */

import fetch from 'isomorphic-fetch'
import NodeCache from 'node-cache'

import { FORUM_URL } from '../../src/consts'

const cache = new NodeCache({ stdTTL: 900 })

const dev = process.env.NODE_ENV === 'development'

export default async (_, res) => {
  if (cache.get('topics')) {
    if (dev) console.log('Using cache for "topics"')

    res.status(200).json(cache.get('topics'))

    return
  } else {
    if (dev) console.log('Not using cache for "topics"')
  }

  try {
    const response = await fetch(`${FORUM_URL}/latest.json?order=created`)

    if (response.status !== 200) {
      res.status(502).json({ error: 'Unexpected response from Forum' })

      return
    }

    const data = await response.text()

    const {
      topic_list: { topics: original_topics }
    } = JSON.parse(data)

    const topics = original_topics.slice(0, 3).map(item => ({
      title: item.title,
      comments: item.posts_count - 1,
      date: item.last_posted_at,
      url: `${FORUM_URL}/t/${item.slug}/${item.id}`
    }))

    cache.set('topics', { topics })

    res.status(200).json({ topics })
  } catch {
    res.status(404)
  }
}
