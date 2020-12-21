/* eslint-env node */

const { createLinkNode } = require('./helpers')
const { getItemByPath } = require('../../src/utils/shared/sidebar')

const DVC_REGEXP = /dvc\s+[a-z][a-z-.]*/
const COMMAND_REGEXP = /^[a-z][a-z-]*$/
const COMMAND_ROOT = '/doc/command-reference/'

module.exports = astNode => {
  const node = astNode[0]
  const parent = astNode[2]

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

    createLinkNode(url, astNode)
  }

  return astNode
}
