const fs = require('fs')
const path = require('upath')

async function crawlPageData(dataPath, onPageData) {
  const stat = fs.statSync(dataPath)
  if (stat.isDirectory()) {
    const paths = fs.readdirSync(dataPath)
    return Promise.all(
      paths.map(name => crawlPageData(path.join(dataPath, name), onPageData))
    )
  } else if (path.basename(dataPath) === 'page-data.json') {
    return await onPageData(dataPath)
  }
}

module.exports = crawlPageData
