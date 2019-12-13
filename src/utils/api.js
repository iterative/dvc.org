import fetch from 'isomorphic-fetch'

export function makeAbsoluteURL(req, uri) {
  const host = req ? req.headers['host'] : window.location.host
  const protocol = host.indexOf('localhost') > -1 ? 'http:' : 'https:'

  return `${protocol}//${host}${uri}`
}

export async function getLatestIssues(req) {
  const res = await fetch(makeAbsoluteURL(req, '/api/github'))
  const { issues } = await res.json()

  return issues
}

export async function getLatestPosts(req) {
  const res = await fetch(makeAbsoluteURL(req, '/api/blog'))
  const { posts } = await res.json()

  return posts
}

export async function getLatestTopics(req) {
  const res = await fetch(makeAbsoluteURL(req, '/api/discourse'))
  const { topics } = await res.json()

  return topics
}

export async function getDiscordInfo(req) {
  const res = await fetch(makeAbsoluteURL(req, '/api/discord'))
  const info = await res.json()

  return info
}
