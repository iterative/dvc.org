/* eslint-env node */

const { getItemByPath } = require('../../src/utils/shared/sidebar')

const DVC_API_REGEXP = /dvc.api([a-z-._]*\(\)$)?/
const METHOD_REGEXP = /^[a-z-._]*\(\)$/
const API_ROOT = '/doc/api-reference/'

module.exports = astNode => {
  const [node, index, parent] = astNode

  if (parent.type !== 'link' && DVC_API_REGEXP.test(node.value)) {
    const parts = node.value.split('.')
    let url

    const method =
      parts[2] && METHOD_REGEXP.test(parts[2]) && parts[2].slice(0, -2)
    const isRoot = parts[0] === 'dvc' && parts[1] === 'api' && !parts[2]

    if (isRoot) {
      url = `${API_ROOT}`
    } else {
      url = `${API_ROOT}${method}`
    }

    const isMethodPageExists = getItemByPath(url)
    if (isMethodPageExists) {
      parent.children[index] = {
        type: 'link',
        url,
        title: null,
        children: [node],
        position: node.position
      }
    }
  }

  return astNode
}
