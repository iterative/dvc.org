export default async function onCreateNode({
  node,
  getNode,
  actions: { createNodeField }
}) {
  const parentNode = getNode(node.parent)
  if (node.internal.type === 'ImageSharp') {
    createNodeField({
      node,
      name: 'sourcePath',
      value: parentNode.relativePath
    })
  }
}
