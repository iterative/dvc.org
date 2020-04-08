/* eslint-env node */

const visit = require('unist-util-visit')
const { getItemByPath } = require('../../src/utils/sidebar')

const DVC_REGEXP = /dvc\s+[a-z][a-z-.]*/
const COMMAND_REGEXP = /^[a-z][a-z-]*$/
const COMMAND_ROOT = '/doc/command-reference/'

module.exports = ({ markdownAST }) => {
  visit(markdownAST, 'inlineCode', function(node, index, parent) {
    if (parent.type !== 'link' && DVC_REGEXP.test(node.value)) {
      const parts = node.value.split(/\s+/)
      let url

      const hasThirdSegment = parts[2] && COMMAND_REGEXP.test(parts[2])
      const isCommandPageExists = getItemByPath(`${COMMAND_ROOT}${parts[1]}`)
      const isSubcommandPageExists =
        isCommandPageExists &&
        hasThirdSegment &&
        getItemByPath(`${COMMAND_ROOT}${parts[1]}/${parts[2]}`)

      if (isSubcommandPageExists) {
        url = `${COMMAND_ROOT}${parts[1]}/${parts[2]}`
      } else if (isCommandPageExists && hasThirdSegment) {
        url = `${COMMAND_ROOT}${parts[1]}#${parts[2]}`
      } else if (isCommandPageExists) {
        url = `${COMMAND_ROOT}${parts[1]}`
      }

      if (url) {
        parent.children[index] = {
          type: 'link',
          url: url,
          children: [node],
          position: node.position
        }
      }
    }
  })

  return markdownAST
}
