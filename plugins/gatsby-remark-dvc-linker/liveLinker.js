/* eslint-env node */

const { createLinkNode } = require('./helpers')
const { getItemByPath } = require('../../src/utils/shared/sidebar')

const LIVE_API_REGEXP = /dvclive.([a-z-._]*\(\)$)?/
const METHOD_REGEXP = /^[a-z-._]*\(\)$/
const API_ROOT = '/doc/dvclive/api-reference/'

module.exports = astNode => {
  const node = astNode[0]
  const parent = astNode[2]

  if (parent.type !== 'link' && LIVE_API_REGEXP.test(node.value)) {
    const parts = node.value.split('.')
    const isMethod = parts[1] && METHOD_REGEXP.test(parts[1])
    const method = isMethod && parts[1].slice(0, -2)
    const url = `${API_ROOT}${method}`

    const isMethodPageExists = getItemByPath(url)
    if (isMethodPageExists) {
      createLinkNode(url, astNode)
    }
  }

  return astNode
}
