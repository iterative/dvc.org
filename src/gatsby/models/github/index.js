let request
;(async () => {
  const mod = await import('@octokit/request')
  request = mod.request
})()

/*
   GitHub Static Data

   This model serves as an intermediary between the templates and
   gatsby-plugin-github-api. If no GITHUB_TOKEN is specified, this node will be
   filled with default dummy data instead of throwing like using the plugin
   alone does.
 */

async function getStars({ owner, repo }) {
  const response = await request({
    method: 'GET',
    url: '/repos/{owner}/{repo}',
    owner,
    repo,
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  })

  const stars = response.data.stargazers_count

  return stars
}

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
              const stars = await getStars({ owner: 'iterative', repo: 'dvc' })
              return { stars }
            }
            return { stars: 12915 }
          }
        }
      }
    })
  }
}
