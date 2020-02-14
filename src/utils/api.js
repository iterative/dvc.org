import fetch from 'isomorphic-fetch'

export function makeAbsoluteURL(req, uri) {
  const host = req ? req.headers['host'] : window.location.host
  const protocol = host.indexOf('localhost') > -1 ? 'http:' : 'https:'

  return `${protocol}//${host}${uri}`
}
export async function getLatestIssues() {
  try {
    const res = await fetch('/api/github')

    if (res.status !== 200) return []

    const { issues } = await res.json()

    return issues
  } catch (e) {
    console.error(e)

    return []
  }
}

export async function getLatestPosts() {
  try {
    const res = await fetch('/api/blog')

    if (res.status !== 200) return []

    const { posts } = await res.json()

    return posts
  } catch (e) {
    console.error(e)

    return []
  }
}

export async function getLatestTopics() {
  try {
    const res = await fetch('/api/discourse')

    if (res.status !== 200) return []

    const { topics } = await res.json()

    return topics
  } catch (e) {
    console.error(e)

    return []
  }
}

export async function getCommentsCount(commentsUrl) {
  try {
    const res = await fetch(`/api/comments?url=${commentsUrl}`)

    if (res.status === 200) {
      const { count } = await res.json()
      return count
    }
  } catch (e) {
    console.error(e)
  }
}
