const fs = require('fs').promises
const path = require('path')
const crawlPageData = require('../utils/shared/crawlPageData')

async function removeFile(filePath) {
  console.log(`Removing stale page-data at "${filePath}"`)
  return fs.unlink(filePath)
}

module.exports = async function pruneStalePageCache({ graphql }) {
  // Remove stale page-data from cache in production

  // Bail out early if we're in dev mode.
  // Doing this in dev would cull an existing build cache to the dev subset.
  if (process.env.NODE_ENV === 'development') return null

  const query = await graphql(`
    {
      allSitePage {
        nodes {
          path
        }
      }
    }
  `)

  if (query.errors)
    throw new Error({
      message: 'Querying for page paths in cache cleaning failed!',
      errors: query.errors
    })

  const pagePathSet = new Set(query.data.allSitePage.nodes.map(x => x.path))

  return crawlPageData('./public/page-data', pageDataPath => {
    const cachedPagePath = /public\/page-data(.*)\/page-data.json/.exec(
      pageDataPath
    )[1]
    // Delete the page-data file if the cached page isn't actually present.
    // Index is a special case, as its path is '/' and dir is '/index'.
    return pagePathSet.has(cachedPagePath)
      ? null
      : cachedPagePath === '/index'
      ? null
      : removeFile(pageDataPath)
  })
}
