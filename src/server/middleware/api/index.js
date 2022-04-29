const routes = require('express').Router()

const comments = require('./comments')
const discourse = require('./discourse')
const { issues, stars } = require('./github')
const { handlePlausibleRequest, handlePlausibleScript } = require('./plausible')

routes.get('/comments', comments)
routes.get('/discourse', discourse)
routes.get('/github/issues', issues)
routes.get('/github/stars', stars)
routes.get('/pl/*', handlePlausibleScript)
routes.post('/event', handlePlausibleRequest)

module.exports = routes
