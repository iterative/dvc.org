const routes = require('express').Router()

const comments = require('./comments')
const discourse = require('./discourse')
const github = require('./github')

routes.get('/comments', comments)
routes.get('/discourse', discourse)
routes.get('/github', github)

module.exports = routes
