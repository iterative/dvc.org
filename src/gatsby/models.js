const markdownContent = require('./models/markdown-content')
const docs = require('./models/docs')
const blog = require('./models/blog')
const authors = require('./models/authors')
const imageSourcePaths = require('./models/image-source-paths')
const glossary = require('./models/glossary')
const github = require('./models/github')

const models = [
  markdownContent,
  docs,
  blog,
  authors,
  imageSourcePaths,
  glossary,
  github
]

module.exports = models
