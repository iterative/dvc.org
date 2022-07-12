const { createRemoteFileNode } = require('gatsby-source-filesystem')

module.exports = {
  async createSchemaCustomization({ actions }) {
    const { createTypes } = actions
    createTypes(`
      type FeedIterativeBlog implements Node {
        picture: File @link(from: "fields.localFile")
      }
    `)
  },
  async onCreateNode({
    node,
    actions: { createNode, createNodeField },
    createNodeId,
    getCache
  }) {
    if (
      node.internal.type === 'FeedIterativeBlog' &&
      node.enclosure.url !== null
    ) {
      const fileNode = await createRemoteFileNode({
        url: node.enclosure.url, // string that points to the URL of the image
        parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
        createNode, // helper function in gatsby-node to generate the node
        createNodeId, // helper function in gatsby-node to generate the node id
        getCache
      })
      // if the file was created, extend the node with "localFile"
      if (fileNode) {
        createNodeField({ node, name: 'localFile', value: fileNode.id })
      }
    }
  }
}
