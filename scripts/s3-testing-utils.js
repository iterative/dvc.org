const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

function md5(input) {
  return crypto
    .createHash('md5')
    .update(typeof input === 'string' ? input : JSON.stringify(input))
    .digest('hex')
}

async function dirTree(nodePath) {
  const dirents = fs.readdirSync(nodePath, { withFileTypes: true })
  const nodes = Promise.all(
    dirents.map(async dirent => {
      const node = {
        name: dirent.name
      }
      if (dirent.isDirectory()) {
        const children = await dirTree(path.join(nodePath, dirent.name))
        if (children.length > 0) {
          node.children = children
        } else {
          return false
        }
      }
      return node
    })
  ).then(nodes => nodes.filter(Boolean).sort((a, b) => a.name < b.name))

  return nodes
}

async function dirTreeHash(dirPath) {
  return md5(await dirTree(dirPath))
}

module.exports = {
  md5,
  dirTree,
  dirTreeHash
}
