const fs = require('fs')
const path = require('path')
const micromatch = require('micromatch')
const excludeList = String(
  fs.readFileSync(path.resolve('scripts', 'exclude-links.txt'))
)
  .split(/[ \t\r\n]+/)
  .filter(Boolean)
const isExcluded = subject =>
  micromatch.isMatch(subject, excludeList, { bash: true })

module.exports = {
  excludeList,
  isExcluded
}
