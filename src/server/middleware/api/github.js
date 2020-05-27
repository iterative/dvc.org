const { graphql } = require('@octokit/graphql')
const NodeCache = require('node-cache')

const { isProduction } = require('../../utils')

const cache = new NodeCache({ stdTTL: 900 })

async function getFreshGithubData() {
  try {
    const { repository } = await graphql(
      `
        {
          repository(owner: "iterative", name: "dvc") {
            stargazers {
              totalCount
            }
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

    const stars = repository.stargazers.totalCount

    cache.set('issues', issues)
    cache.set('stars', stars)

    return { issues, stars }
  } catch (e) {
    return { error: e.message || e }
  }
}

async function issues(_, res) {
  if (!process.env.GITHUB_TOKEN) {
    res
      .status(200)
      .json({ issues: [], error: 'No GITHUB_TOKEN specified on the server!' })
  } else {
    if (cache.get('issues')) {
      if (!isProduction) console.log('Using cache for "issues"')

      res.status(200).json({ issues: cache.get('issues') })
    } else {
      console.log('Not using cache for "issues"')
      const { issues } = await getFreshGithubData()
      if (!issues) {
        res.status(404)
      } else {
        res.status(200).json({ issues })
      }
    }
  }
}

async function getStars() {
  const cachedValue = cache.get('stars')
  if (cachedValue) {
    if (!isProduction) console.log('Using cache for "stars"')
    return cachedValue
  } else {
    console.log('Not using cache for "stars"')
    const { stars } = await getFreshGithubData()
    return stars
  }
}

async function stars(req, res) {
  if (!process.env.GITHUB_TOKEN) {
    res.status(403).json({ error: 'No GITHUB_TOKEN specified on the server!' })
  } else {
    const stars = await getStars()
    if (stars) {
      // If the data in unchanged, return a minimal response indicating so.
      if (Number(req.query.current) === stars) {
        console.log(`GitHub stars not changed from ${stars}`)
        res.status(304)
      } else {
        res.status(200).json({ stars })
      }
    } else {
      res.status(404)
    }
  }
}

module.exports = {
  stars,
  issues
}
