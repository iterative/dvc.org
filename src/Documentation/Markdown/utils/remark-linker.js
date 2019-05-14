;`use strict`

import visit from 'unist-util-visit'

function linker() {
  function transformer(tree) {
    visit(tree, 'inlineCode', function(node, index, parent) {
      if (parent.type !== 'link' && /dvc\s+[a-z-.]+/.test(node.value)) {
        let parts = node.value.split(/\s+/)
        let url = '/doc/commands-reference/' + parts[1]

        if (parts.length > 2) {
          url += '#' + parts[2]
        }

        parent.children[index] = {
          type: 'link',
          url: url,
          children: [node],
          position: node.position
        }
      }
    })
    return tree
  }

  return transformer
}

export default linker
