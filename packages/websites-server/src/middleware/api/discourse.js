const fetch = require('isomorphic-fetch')
const NodeCache = require('node-cache')

const { forumUrl } = require('../../config')
const { isProduction } = require('../../utils')

const cache = new NodeCache({ stdTTL: 900 })

module.exports = async (_, res) => {
  if (cache.get('topics')) {
    if (!isProduction) console.log('Using cache for "topics"')

    res.status(200).json(cache.get('topics'))

    return
  } else {
    if (!isProduction) console.log('Not using cache for "topics"')
  }

  try {
    const response = await fetch(`${forumUrl}/latest.json?order=created`)

    if (response.status !== 200) {
      res.status(502).json({ error: 'Unexpected response from Forum' })

      return
    }

    const data = await response.text()

    const {
      topic_list: { topics: originalTopics }
    } = JSON.parse(data)

    const topics = originalTopics.slice(0, 3).map(item => ({
      title: item.title,
      comments: item.posts_count - 1,
      date: item.last_posted_at,
      url: `${forumUrl}/t/${item.slug}/${item.id}`
    }))

    cache.set('topics', { topics })

    res.status(200).json({ topics })
  } catch {
    res.sendStatus(404)
  }
}
