let request
;(async () => {
  const mod = await import('@octokit/request')
  request = mod.request
})()
const NodeCache = require('node-cache')

const { isProduction } = require('../../utils')

const cache = new NodeCache({ stdTTL: 900 })

const getCacheName = (...args) => {
  return args.join('-')
}

async function getFreshStars({ owner, repo }) {
  const starsResponse = await request({
    method: 'GET',
    url: '/repos/{owner}/{repo}',
    owner,
    repo,
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  })

  const stars = starsResponse.data.stargazers_count

  cache.set(getCacheName(owner, repo, 'stars'), stars)

  return stars
}

async function getFreshIssues({ owner, repo }) {
  const issuesResponse = await request({
    method: 'GET',
    url: '/repos/{owner}/{repo}/issues?per_page=3',
    owner,
    repo,
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  })
  const issues = issuesResponse.data.map(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ({ title, html_url, comments, created_at }) => ({
      title,
      url: html_url,
      comments,
      date: created_at
    })
  )

  cache.set(getCacheName(owner, repo, 'issues'), issues)

  return issues
}

async function getFreshGithubData({ owner, repo }) {
  try {
    const starsPromise = await getFreshStars({ owner, repo })
    const issuesPromise = await getFreshIssues({ owner, repo })

    const stars = await starsPromise
    const issues = await issuesPromise

    return { issues, stars }
  } catch (e) {
    console.error(e)
    return { error: e.message || e }
  }
}

async function issues(req, res) {
  if (!process.env.GITHUB_TOKEN) {
    // We have no GitHub key, so reject as unauthorized
    res.status(403).send()
  } else {
    const { owner = 'iterative', repo = 'dvc' } = req.query
    const cachedValue = cache.get(getCacheName(owner, repo, 'issues'))
    if (cachedValue) {
      if (!isProduction) console.log('Using cache for "issues"')
      res.status(200).json({ issues: cachedValue })
    } else {
      console.log('Not using cache for "issues"')
      const { issues } = await getFreshGithubData({
        owner,
        repo
      })
      if (!issues) {
        // No cached nor fresh issues found: return 404
        res.status(404).send()
      } else {
        res.status(200).json({ issues })
      }
    }
  }
}

async function getStars({ owner, repo }) {
  const cachedValue = cache.get(getCacheName(owner, repo, 'stars'))
  if (cachedValue) {
    if (!isProduction) console.log('Using cache for "stars"')
    return cachedValue
  } else {
    console.log('Not using cache for "stars"')
    const { stars } = await getFreshGithubData({
      owner,
      repo
    })
    return stars
  }
}

async function stars(req, res) {
  if (!process.env.GITHUB_TOKEN) {
    // We have no GitHub key, so reject as unauthorized
    res.status(403).send()
  } else {
    const { owner = 'iterative', repo = 'dvc' } = req.query
    const stars = await getStars({
      owner,
      repo
    })
    if (stars) {
      // If we got stars, successfully return a data payload with them
      res.status(200).json({ stars })
    } else {
      // Stars are missing for some reason: return 404
      res.status(404).send()
    }
  }
}

module.exports = {
  stars,
  issues
}
