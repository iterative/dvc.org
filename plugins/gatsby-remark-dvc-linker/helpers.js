const unified = require('unified')
const remarkHtml = require('remark-html')
const remarkParse = require('remark-parse')
const removePosition = require('unist-util-remove-position')

// We do not need to consider the position of the AST nodes
const buildAst = mdToBuild =>
  removePosition(unified().use(remarkHtml).use(remarkParse).parse(mdToBuild))

const createLinkNode = (url, [node, index, parent]) =>
  url &&
  (parent.children[index] = {
    type: 'link',
    url,
    title: null,
    children: [node],
    position: node.position
  })

module.exports = { buildAst, createLinkNode }
