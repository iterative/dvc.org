const markdownContent = require('./models/markdown-content')
const docs = require('./models/docs')
const blog = require('./models/blog')
const authors = require('./models/authors')
const imageSourcePaths = require('./models/image-source-paths')

const models = [markdownContent, docs, blog, authors, imageSourcePaths]

module.exports = models
