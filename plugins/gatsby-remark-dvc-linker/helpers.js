const createLinkNode = (url, index, parent, node) =>
  url &&
  (parent.children[index] = {
    type: 'link',
    url,
    children: [node],
    position: node.position
  })

module.exports = { createLinkNode }
