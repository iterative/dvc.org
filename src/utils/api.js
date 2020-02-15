import fetch from 'isomorphic-fetch'

export function makeAbsoluteURL(req, uri) {
  const host = req ? req.headers['host'] : window.location.host
  const protocol = host.indexOf('localhost') > -1 ? 'http:' : 'https:'

  return `${protocol}//${host}${uri}`
}

export async function getLatestIssues(req) {
  try {
    const res = await fetch(makeAbsoluteURL(req, '/api/github'))

    if (res.status !== 200) return []

    const { issues } = await res.json()

    return issues
  } catch (e) {
    console.error(e)

    return []
  }
}

export async function getLatestPosts(req) {
  try {
    const res = await fetch(makeAbsoluteURL(req, '/api/blog'))

    if (res.status !== 200) return []

    const { posts } = await res.json()

    return posts
  } catch (e) {
    console.error(e)

    return []
  }
}

export async function getLatestTopics(req) {
  try {
    const res = await fetch(makeAbsoluteURL(req, '/api/discourse'))

    if (res.status !== 200) return []

    const { topics } = await res.json()

    return topics
  } catch (e) {
    console.error(e)

    return []
  }
}
