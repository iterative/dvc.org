/* eslint-env node */

const routes = require('express').Router()

const blog = require('./blog')
const comments = require('./comments')
const discourse = require('./discourse')
const github = require('./github')

routes.get('/blog', blog)
routes.get('/comments', comments)
routes.get('/discourse', discourse)
routes.get('/github', github)

module.exports = routes
