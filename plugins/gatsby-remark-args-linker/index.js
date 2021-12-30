const visit = require('unist-util-visit')

const argsRegex = new RegExp(/\-{1,2}[a-zA-Z-]*/, 'ig')

function patch(context, key, value) {
  if (!context[key]) {
    context[key] = value
  }

  return context[key]
}

module.exports = ({ markdownAST }) => {
  visit(
    markdownAST,
    node =>
      node.type === 'listItem' &&
      node.children.some(
        item =>
          item.type === 'paragraph' &&
          item.children[0]?.type === 'inlineCode' &&
          String(item.children[0]?.value).startsWith('-')
      ),
    listItemNode => {
      const paragraphNode = listItemNode.children.find(
        item => item.type === 'paragraph'
      )
      const inlineCodeNode = paragraphNode.children.find(
        item => item.type === 'inlineCode'
      )
      const value = inlineCodeNode.value
      if (String(value).startsWith('-')) {
        const id = value.match(argsRegex)[0]
        const data = patch(listItemNode, `data`, {})

        patch(data, `id`, id)
        patch(data, `htmlAttributes`, {})
        patch(data, `hProperties`, {})
        patch(data.htmlAttributes, `id`, id)
        patch(data.hProperties, `id`, id)
      }
    }
  )
  // Manipulate AST
  return markdownAST
}
