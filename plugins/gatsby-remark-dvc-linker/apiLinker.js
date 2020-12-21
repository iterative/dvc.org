/* eslint-env node */

const { createLinkNode } = require('./helpers')
const { getItemByPath } = require('../../src/utils/shared/sidebar')

const DVC_API_REGEXP = /dvc.api([a-z-._]*\(\)$)?/
const METHOD_REGEXP = /^[a-z-._]*\(\)$/
const API_ROOT = '/doc/api-reference/'

module.exports = astNode => {
  const node = astNode[0]
  const parent = astNode[2]

  if (parent.type !== 'link' && DVC_API_REGEXP.test(node.value)) {
    const parts = node.value.split('.')
    let url

    const isMethod = parts[2] && METHOD_REGEXP.test(parts[2])
    const method = isMethod && parts[2].slice(0, -2)
    const isRoot = parts[0] === 'dvc' && parts[1] === 'api' && !parts[2]

    if (isRoot) {
      url = `${API_ROOT}`
    } else {
      url = `${API_ROOT}${method}`
    }

    const isMethodPageExists = getItemByPath(url)
    if (isMethodPageExists) {
      createLinkNode(url, astNode)
    }
  }

  return astNode
}
