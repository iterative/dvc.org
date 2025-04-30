const blogFeed = require('./models/blogFeed')
const github = require('./models/github')
const imageSourcePaths = require('./models/image-source-paths')
const pruneCache = require('./models/prune-cache')

const models = [blogFeed, imageSourcePaths, github, pruneCache]

module.exports = models
