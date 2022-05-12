const routes = require('express').Router()

const comments = require('./comments')
const discourse = require('./discourse')
const { issues, stars, auth, callback } = require('./github')

routes.get('/comments', comments)
routes.get('/discourse', discourse)
routes.get('/github/issues', issues)
routes.get('/github/stars', stars)
routes.get('/github/auth', auth)
routes.get('/github/callback', callback)

module.exports = routes
