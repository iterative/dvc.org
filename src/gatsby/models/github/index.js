const { graphql } = require('@octokit/graphql')
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
          async resolve() {
            const { GITHUB_TOKEN } = process.env
            if (GITHUB_TOKEN) {
              const query = await graphql(
                `
                  {
                    repository(owner: "iterative", name: "dvc") {
                      stargazers {
                        totalCount
                      }
                    }
                  }
                `,
                { headers: { authorization: `token ${GITHUB_TOKEN}` } }
              )

              const stars = query.repository.stargazers.totalCount
              return { stars }
            }
            return { stars: 8888 }
          }
        }
      }
    })
  }
}
