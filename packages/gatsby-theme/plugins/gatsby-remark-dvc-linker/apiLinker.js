/* eslint-env node */

const consts = require('../../consts')
const { getItemByPath } = require('../../src/utils/shared/sidebar')

const { createLinkNode } = require('./helpers')

const { CLI_API_REGEXP, METHOD_REGEXP, API_ROOT } = consts

module.exports = astNode => {
  const node = astNode[0]
  const parent = astNode[2]

  if (parent.type !== 'link' && CLI_API_REGEXP.test(node.value)) {
    const parts = node.value.split('.')
    let url

    const isMethod = parts[2] && METHOD_REGEXP.test(parts[2])
    const method = isMethod && parts[2].slice(0, -2)
    const isRoot =
      (parts[0] === 'dvc' || parts[0] === 'mlem') &&
      parts[1] === 'api' &&
      !parts[2]

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
