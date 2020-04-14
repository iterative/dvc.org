module.exports = {
  async onCreateNode(
    { node, getNode, actions: { createNodeField } },
    options,
    { parentNode = getNode(node.parent) }
  ) {
    if (node.internal.type === 'ImageSharp') {
      createNodeField({
        node,
        name: 'sourcePath',
        value: parentNode.relativePath
      })
    }
  }
}
