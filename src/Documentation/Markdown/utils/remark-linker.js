`use strict`

import visit from 'unist-util-visit'

function linker() {

  function transformer(tree) {
    visit(tree, 'inlineCode', function(node, index, parent) {
      if (parent.type !== 'link' && /dvc [a-z-.]+/.test(node.value)) {
        parent.children[index] = {
          type: 'link',
          url: 'https://dvc.org/doc/commands-reference/' + node.value.split(' ')[1],
          children: [node],
          position: node.position
        };
      }
    })
    return tree
  }

  return transformer
}

export default linker