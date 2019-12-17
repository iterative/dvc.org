/* eslint-env node */
/* eslint max-len:0 */

const { graphql } = require('@octokit/graphql')

// Mock data is used if process.env.GITHUB_TOKEN is not set

const mock = {
  issues: [
    {
      title:
        'ssh/sftp: detect that we are not in a physical root and print a meaninful error...',
      url: 'https://github.com/iterative/dvc/issues/2936',
      comments: 1,
      date: 1576072266986
    },
    {
      title: 'pipeline show: use pager instead of rendering ourselves',
      url: 'https://github.com/iterative/dvc/issues/2937',
      comments: 0,
      date: 1576072266986
    },
    {
      title:
        'tests: disabling analytics through `config --global` breaks tests',
      url: 'https://github.com/iterative/dvc/issues/2938',
      comments: 1,
      date: 1576072266986
    }
  ]
}

export default async (_, res) => {
  if (!process.env.GITHUB_TOKEN) {
    res.status(200).json(mock)
  } else {
    try {
      const { repository } = await graphql(
        `
          {
            repository(owner: "iterative", name: "dvc") {
              issues(last: 3, states: OPEN) {
                edges {
                  node {
                    title
                    createdAt
                    url
                    comments {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        `,
        {
          headers: {
            authorization: `token ${process.env.GITHUB_TOKEN}`
          }
        }
      )

      res.status(200).json({
        issues: repository.issues.edges.map(({ node }) => ({
          title: node.title,
          url: node.url,
          comments: node.comments.totalCount,
          date: node.createdAt
        }))
      })
    } catch (e) {
      res.status(404)
    }
  }
}
