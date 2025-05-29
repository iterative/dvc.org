const routes = require('express').Router()

const comments = require('./comments')
const discourse = require('./discourse')
const { issues, stars } = require('./github')
const subscribe = require('./subscribe')

routes.get('/comments', comments)
routes.get('/discourse', discourse)
routes.use('/subscribe', subscribe)
routes.get('/github/issues', issues)
routes.get('/github/stars', stars)

module.exports = routes
