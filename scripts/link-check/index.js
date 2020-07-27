// CLI runner for link-check-git-diff
const { getCheckedAddedLinks } = require('./link-check-git-diff.js')
const formatLinks = require('./formatting.js')
const baseURL = process.env.CHECK_LINKS_RELATIVE_URL

getCheckedAddedLinks(baseURL).then(links => {
  console.log(formatLinks(links))
})
