import fetch from 'isomorphic-fetch'
import cache from './utils/cache'

export default async (_, res) => {
  cache(res, 300)
  try {
    const response = await fetch(`https://blog.dvc.org/api/posts.json`)

    if (response.status !== 200) {
      res.status(502).json({ error: 'Unexpected response from Blog' })

      return
    }

    const data = await response.text()

    res.status(200).json(data)
  } catch {
    res.status(502)
  }
}
