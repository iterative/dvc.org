import Cors from 'micro-cors'
import request from 'request'

const cors = Cors({
  allowedMethods: ['GET', 'HEAD']
})

const getCommentCount = (req, res) => {
  const {
    query: { url }
  } = req

  request(`${url}.json`, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      res.status(404).json({ error })
    } else {
      // post_count return all posts including topic itself
      const count = JSON.parse(body).posts_count - 1

      res.status(200).json({ count })
    }
  })
}

export default cors(getCommentCount)
