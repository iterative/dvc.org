// CLI runner for link-check-git-diff
const { getCheckedAddedLinks } = require('./link-check-git-diff.js')
const formatLinks = require('./formatting.js')

getCheckedAddedLinks().then(links => {
  console.log(formatLinks(links))
})
