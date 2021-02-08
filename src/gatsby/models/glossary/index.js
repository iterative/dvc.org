const { parentResolverPassthrough } = require('gatsby-plugin-parent-resolvers')
const remark = require('remark')
const recommended = require('remark-preset-lint-recommended')
const remarkHtml = require('remark-html')

const tooltipHTMLProcessor = remark().use(recommended).use(remarkHtml)

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
          tooltip: {
            type: 'String!',
            resolve: (source, args, context, info) => {
              return (
                source.tooltip ||
                parentResolverPassthrough({ field: 'html' })(
                  source,
                  args,
                  context,
                  info
                )
              )
            }
          },
          name: 'String!',
          match: '[String]'
        }
      })
    ]
    createTypes(typeDefs)
  },
  async onCreateMarkdownContentNode(api, { parentNode, createChildNode }) {
    // Only operate on nodes within the concepts folder
    if (parentNode.relativeDirectory !== 'docs/user-guide/concepts') return

    const { node, createNodeId, createContentDigest } = api

    const {
      frontmatter: { name, match, tooltip }
    } = node

    const fieldData = {
      name,
      match,
      tooltip: tooltip && tooltipHTMLProcessor.processSync(tooltip).toString()
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

    return createChildNode(entryNode)
  }
}
