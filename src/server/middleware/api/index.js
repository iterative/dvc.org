const routes = require('express').Router()

const comments = require('./comments')
const discourse = require('./discourse')
const { issues, stars } = require('./github')
const { handlePlausibleRequest } = require('./plausible')

routes.get('/comments', comments)
routes.get('/discourse', discourse)
routes.get('/github/issues', issues)
routes.get('/github/stars', stars)
routes.all('/pl/*', handlePlausibleRequest)

module.exports = routes
