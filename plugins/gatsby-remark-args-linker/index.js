const visit = require('unist-util-visit')

const argsRegex = new RegExp(/\-{1,2}[a-zA-Z-]*/, 'ig')

function patch(context, key, value) {
  if (!context[key]) {
    context[key] = value
  }

  return context[key]
}
const svgIcon = `<svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`

const addIdAttrToNode = (node, id) => {
  const data = patch(node, `data`, {})

  patch(data, `id`, id)
  patch(data, `htmlAttributes`, {})
  patch(data, `hProperties`, {})
  patch(data.htmlAttributes, `id`, id)
  patch(data.hProperties, `id`, id)
}

module.exports = (
  { markdownAST },
  { className = 'anchor', isIconAfterHeader = false }
) => {
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
      const isParagraphNode = listItemNode.children?.[0].type === 'paragraph'
      if (!isParagraphNode) return
      const paragraphNode = listItemNode.children[0]
      const isFirstArgNode =
        paragraphNode.children[0]?.type === 'inlineCode' &&
        String(paragraphNode.children[0]?.value).startsWith('-')
      if (isFirstArgNode) {
        const firstArgNode = paragraphNode.children[0]
        const value = firstArgNode.value
        const id = value.match(argsRegex)[0]
        addIdAttrToNode(listItemNode, id)

        const data = patch(listItemNode, `data`, {})
        patch(data, `htmlAttributes`, {})
        patch(data, `hProperties`, {})
        patch(data.hProperties, `style`, `position:relative;`)
        const label = id.split(`-`).join(` `)
        const method = isIconAfterHeader ? `push` : `unshift`
        listItemNode.children[method]({
          type: `link`,
          url: `#${id}`,
          title: null,
          children: [],
          data: {
            hProperties: {
              'aria-label': `option ${label.trim()} permalink`,
              class: `${className} ${isIconAfterHeader ? `after` : `before`}`
            },
            hChildren: [
              {
                type: `raw`,
                // The Octicon link icon is the default. But users can set their own icon via the "icon" option.
                value: svgIcon
              }
            ]
          }
        })

        const isSecondArgNode =
          String(paragraphNode.children[1]?.value).trim() === ',' &&
          paragraphNode.children[2]?.type === 'inlineCode' &&
          String(paragraphNode.children[2].value).startsWith('-')
        if (isSecondArgNode) {
          const secondArgNode = paragraphNode.children[2]
          const value = secondArgNode.value
          const id = value.match(argsRegex)[0]
          addIdAttrToNode(paragraphNode, id)
        }
      }
    }
  )
  // Manipulate AST
  return markdownAST
}
