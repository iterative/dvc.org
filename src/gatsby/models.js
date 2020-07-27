const markdownContent = require('./models/markdown-content')
const docs = require('./models/docs')
const blog = require('./models/blog')
const authors = require('./models/authors')
const imageSourcePaths = require('./models/image-source-paths')
const jsonFiles = require('./models/json-files')
const communityPage = require('./models/community')
const glossary = require('./models/glossary')
const github = require('./models/github')
const pruneCache = require('./models/prune-cache')

const models = [
  markdownContent,
  docs,
  blog,
  authors,
  imageSourcePaths,
  jsonFiles,
  communityPage,
  glossary,
  github,
  pruneCache
]

module.exports = models
