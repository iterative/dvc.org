const markdownContent = require('./models/markdown-content')
const docs = require('./models/docs')
const blog = require('./models/blog')
const authors = require('./models/authors')

const models = [markdownContent, docs, blog, authors]

module.exports = models
