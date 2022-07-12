const markdownContent = require('./models/markdown-content')
const imageSourcePaths = require('./models/image-source-paths')
const github = require('./models/github')
const pruneCache = require('./models/prune-cache')
const blogFeed = require('./models/blogFeed')

const models = [blogFeed, markdownContent, imageSourcePaths, github, pruneCache]

module.exports = models
