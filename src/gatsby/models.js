const markdownContent = require('./models/markdown-content')
const blog = require('./models/blog')
const authors = require('./models/authors')
const imageSourcePaths = require('./models/image-source-paths')
const github = require('./models/github')
const pruneCache = require('./models/prune-cache')

const models = [
  markdownContent,
  blog,
  authors,
  imageSourcePaths,
  github,
  pruneCache
]

module.exports = models
