/* eslint-env node */

import fetch from 'isomorphic-fetch'
import cache from './utils/cache'

import { FORUM_URL } from '../../src/consts'

export default async (_, res) => {
  cache(res)

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

    res.status(200).json({ topics })
  } catch {
    res.status(404)
  }
}
