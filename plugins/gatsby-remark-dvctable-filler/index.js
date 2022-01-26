const visit = require('unist-util-visit')
const dvctableFiller = require('./filler')

module.exports = ({ markdownAST }) => {
  visit(markdownAST, 'code', dvctableFiller)
  return markdownAST
}
