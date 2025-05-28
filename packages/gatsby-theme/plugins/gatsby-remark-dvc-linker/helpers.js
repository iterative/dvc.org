/* eslint-disable react-hooks/rules-of-hooks */
// We do not need to consider the position of the AST nodes
const buildAst = async mdToBuild => {
  const { unified } = await import('unified')
  const remarkHtml = await import('remark-html')
  const remarkParse = await import('remark-parse')
  const removePosition = await import('unist-util-remove-position')

  return removePosition(
    unified().use(remarkHtml).use(remarkParse).parse(mdToBuild)
  )
}

const useMatcher = (matcher, item) => {
  switch (typeof matcher) {
    case 'string':
      return item === matcher
    case 'object':
      if (Array.isArray(matcher))
        return matcher.find(submatcher => useMatcher(submatcher, item))
      if (matcher instanceof RegExp) return matcher.match(item)
      break
    default:
      throw `gatsby-remark-dvc-linker simpleLinker given bad matcher of type "${typeof matcher}"`
  }
}

const createLinkNode = (url, [node, index, parent]) =>
  url &&
  (parent.children[index] = {
    type: 'link',
    url,
    title: null,
    children: [node],
    position: node.position
  })

module.exports = { buildAst, createLinkNode, useMatcher }
