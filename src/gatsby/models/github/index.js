/*
   GitHub Static Data

   This model serves as an intermediary between the templates and
   gatsby-plugin-github-api. If no GITHUB_TOKEN is specified, this node will be
   filled with default dummy data instead of throwing like using the plugin
   alone does.
 */

module.exports = {
  async createSchemaCustomization({ actions: { createTypes }, schema }) {
    createTypes(
      schema.buildObjectType({
        name: 'StaticGithubData',
        fields: {
          stars: 'String'
        }
      })
    )
  },
  async createResolvers({ createResolvers }) {
    createResolvers({
      Query: {
        staticGithubData: {
          type: 'StaticGithubData',
          async resolve(source, args, context) {
            const nodes = await context.nodeModel.getAllNodes({
              type: 'GithubData'
            })
            const node = nodes[0]
            return node
              ? {
                  stars: node.rawResult.data.repository.stargazers.totalCount
                }
              : {
                  stars: 8888
                }
          }
        }
      }
    })
  }
}
