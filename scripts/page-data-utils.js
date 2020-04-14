const xmlParser = require('xml2json')
const path = require('path')
const fs = require('fs')
const { parse } = require('url')

const rootDir = path.join(__dirname, '..')
const exceptionFolders = ['index', '404', '404.html']

const getPagesListFromManifest = () => {
  const sitemapXml = fs.readFileSync(path.join(rootDir, 'public/sitemap.xml'))
  const sitemap = JSON.parse(xmlParser.toJson(sitemapXml))
  return sitemap.urlset.url.map(u => u.loc)
}

const handlePageParts = (accumulator, parts) => {
  const [current, ...restParts] = parts

  if (!current) {
    return
  }

  if (!accumulator[current]) {
    accumulator[current] = {}
  }

  handlePageParts(accumulator[current], restParts)
}

const buildTree = pages => {
  const pagesPathnames = pages.map(url => parse(url).pathname)
  const pagesParts = pagesPathnames.map(path =>
    path.replace('/', '').split('/')
  )
  const tree = {}

  pagesParts.forEach(pageParts => handlePageParts(tree, pageParts))
  exceptionFolders.forEach(exception => (tree[exception] = {}))
  return tree
}

const deleteDir = dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(item => {
      const currentPath = path.join(dir, item)
      if (fs.lstatSync(currentPath).isDirectory()) {
        deleteFolderRecursive(currentPath)
      } else {
        fs.unlinkSync(currentPath)
      }
    })
    fs.rmdirSync(dir)
  }
}

const checkPageDataPath = (dir, pagesTree) => {
  const dirItems = fs.readdirSync(dir)

  dirItems.forEach(item => {
    const itemPath = path.join(dir, item)
    const itemStat = fs.statSync(itemPath)

    if (itemStat.isDirectory()) {
      if (!pagesTree[item]) {
        console.warn(
          `deleting page-data folder for outdated page at ${itemPath}`
        )
        return deleteDir(itemPath)
      } else {
        checkPageDataPath(itemPath, pagesTree[item])
      }
    }
  })
}

const cleanUpPageData = () => {
  const pages = getPagesListFromManifest()
  const pagesTree = buildTree(pages)
  const pagesDataRoot = path.join(rootDir, 'public/page-data')

  checkPageDataPath(pagesDataRoot, pagesTree)
}

module.exports = {
  cleanUpPageData
}
