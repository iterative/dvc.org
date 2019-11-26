import Cors from 'micro-cors'
import request from 'request'

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
    res.status(404).json({ error: `URL should starts with '${FORUM_URL}'` })

    return
  }

  request(`${url}.json`, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      res.status(404).json({ error: 'Forum returned incorrect response' })

      return
    }

    const json = JSON.parse(body)

    if (!json.posts_count) {
      res.status(404).json({ error: "Forum's don't have 'posts_count' field" })

      return
    }

    // post_count return all posts including topic itself
    const count = json.posts_count - 1

    res.status(200).json({ count })
  })
}

export default cors(getCommentCount)
