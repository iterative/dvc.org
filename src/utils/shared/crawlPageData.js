const fs = require('fs').promises
const path = require('path')

async function crawlPageData(dataPath, onPageData) {
  const stat = await fs.stat(dataPath)
  if (stat.isDirectory()) {
    const paths = await fs.readdir(dataPath)
    return Promise.all(
      paths.map(name => crawlPageData(path.join(dataPath, name), onPageData))
    )
  } else if (path.basename(dataPath) === 'page-data.json') {
    return onPageData(dataPath)
  }
}

module.exports = crawlPageData
