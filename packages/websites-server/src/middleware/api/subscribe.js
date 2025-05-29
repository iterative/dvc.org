const routes = require('express').Router()
const fetch = require('isomorphic-fetch')

routes.post('/dvcx/waitlist', async (req, res) => {
  try {
    const { email, tags } = req.body

    if (!email) {
      return res
        .status(400)
        .json({ error: true, message: 'Email is required.' })
    }

    const response = await fetch(
      'https://dvc.us10.list-manage.com/subscribe/post?u=a08bf93caae4063c4e6a351f6&amp%3Bid=69199951ce&amp%3Bf_id=009ad9e5f0',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          EMAIL: email,
          tags: tags
        })
      }
    )
    if (!response.ok) {
      return res
        .status(400)
        .json({ error: true, message: 'Subscription Error.' })
    }
    return res.json({ ok: true, error: false })
  } catch {
    return res.status(400).json({ error: true, message: 'Subscription Error.' })
  }
})

module.exports = routes
