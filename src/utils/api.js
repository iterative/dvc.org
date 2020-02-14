import { useEffect, useState } from 'react'
import fetch from 'isomorphic-fetch'

export function makeAbsoluteURL(req, uri) {
  const host = req ? req.headers['host'] : window.location.host
  const protocol = host.indexOf('localhost') > -1 ? 'http:' : 'https:'

  return `${protocol}//${host}${uri}`
}

const useAPICall = url => {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        const res = await fetch(url)

        if (!cancelled) {
          if (res.status !== 200) {
            setError('Wrong response types')
          } else {
            setResult(await res.json())
          }
        }
      } catch {
        if (!cancelled) setError('Error loading request')
      } finally {
        if (!cancelled) setReady(true)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [])

  return { error, ready, result }
}

export function useIssues() {
  const { error, ready, result } = useAPICall('/api/github')

  return { error, ready, result: result && result.issues }
}

export function usePosts() {
  const { error, ready, result } = useAPICall('/api/blog')

  return { error, ready, result: result && result.posts }
}

export function useTopics() {
  const { error, ready, result } = useAPICall('/api/discourse')

  return { error, ready, result: result && result.topics }
}

export function useCommentsCount(commentsUrl) {
  const { error, ready, result } = useAPICall(
    `/api/comments?url=${commentsUrl}`
  )

  return { error, ready, result: result && result.count }
}
