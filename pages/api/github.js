/* eslint-env node */

import { graphql } from '@octokit/graphql'
import cache from './utils/cache'

export default async (_, res) => {
  cache(res)

  if (!process.env.GITHUB_TOKEN) {
    res.status(200).json({ issues: [] })
  } else {
    try {
      const { repository } = await graphql(
        `
          {
            repository(owner: "iterative", name: "dvc") {
              issues(
                first: 3
                states: OPEN
                orderBy: { field: CREATED_AT, direction: DESC }
              ) {
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

      const issues = repository.issues.edges.map(({ node }) => ({
        title: node.title,
        url: node.url,
        comments: node.comments.totalCount,
        date: node.createdAt
      }))

      res.status(200).json({ issues })
    } catch (e) {
      res.status(404)
    }
  }
}
