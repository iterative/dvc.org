/* eslint-env node */

const { createLinkNode } = require('./helpers')

const entries = require('../../content/linked-terms')

const excludedParentTypes = ['link', 'heading']

const useMatcher = (matcher, item) => {
  switch (typeof matcher) {
    case 'string':
      return item === matcher
    case 'object':
      if (Array.isArray(matcher))
        return matcher.find(submatcher => useMatcher(submatcher, item))
      if (matcher instanceof RegExp) return matcher.match(item)
    default:
      throw `gatsby-remark-dvc-linker simpleLinker given bad matcher of type "${typeof matcher}"`
  }
}

module.exports = astNode => {
  const node = astNode[0]
  const parent = astNode[2]

  if (!excludedParentTypes.includes(parent.type)) {
    const entry = entries.find(({ matches }) => useMatcher(matches, node.value))
    if (entry) {
      createLinkNode(entry.url, astNode)
    }
  }

  return astNode
}
