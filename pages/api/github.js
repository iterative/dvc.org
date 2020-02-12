/* eslint-env node */

import { graphql } from '@octokit/graphql'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 900 })

export default async (_, res) => {
  if (!process.env.GITHUB_TOKEN) {
    res.status(200).json({ issues: [] })
  } else {
    if (cache.get('issues')) {
      console.log('Using cache for "issues"')

      res.status(200).json({ issues: cache.get('issues') })
    } else {
      console.log('Not using cache for "issues"')
    }

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

      cache.set('issues', issues)

      res.status(200).json({ issues })
    } catch (e) {
      res.status(404)
    }
  }
}
