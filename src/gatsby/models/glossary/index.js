const { parentResolverPassthrough } = require('gatsby-plugin-parent-resolvers')

module.exports = {
  createSchemaCustomization({
    actions: { createTypes },
    schema: { buildObjectType }
  }) {
    const typeDefs = [
      buildObjectType({
        name: 'GlossaryEntry',
        interfaces: ['Node'],
        fields: {
          html: {
            type: 'String!',
            resolve: parentResolverPassthrough()
          },
          name: 'String!',
          match: '[String]'
        }
      })
    ]
    createTypes(typeDefs)
  },
  async onCreateMarkdownContentNode(api, { parentNode }) {
    // Only operate on nodes within the docs/glossary folder.
    if (parentNode.relativeDirectory !== 'docs/user-guide/basic-concepts')
      return

    const {
      node,
      actions: { createNode, createParentChildLink },
      createNodeId,
      createContentDigest
    } = api

    const {
      frontmatter: { name, match }
    } = node

    const fieldData = {
      name,
      match
    }

    const entryNode = {
      ...fieldData,
      id: createNodeId(`DVCGlossaryEntry >>> ${node.id}`),
      parent: node.id,
      children: [],
      internal: {
        type: `GlossaryEntry`,
        contentDigest: createContentDigest(fieldData)
      }
    }

    await createNode(entryNode)
    await createParentChildLink({ parent: node, child: entryNode })
  }
}
