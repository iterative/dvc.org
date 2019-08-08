;`use strict`

import visit from 'unist-util-visit'
import { getItemByPath } from '../../SidebarMenu/helper'

function linker() {
  function transformer(tree) {
    visit(tree, 'inlineCode', function(node, index, parent) {
      if (parent.type !== 'link' && /dvc\s+[a-z-.]+/.test(node.value)) {
        let parts = node.value.split(/\s+/)

        let tmpUrl = '/doc/commands-reference/'
        let url

        if (getItemByPath(tmpUrl + parts[1])) {
          url = tmpUrl = tmpUrl + parts[1]
        }

        if (parts.length > 2) {
          if (getItemByPath(tmpUrl + parts[2])) {
            url += '/' + parts[2]
          } else {
            url += '#' + parts[2]
          }
        }

        if (url) {
          parent.children[index] = {
            type: 'link',
            url: url,
            children: [node],
            position: node.position
          }
        }
      }
    })
    return tree
  }

  return transformer
}

export default linker
