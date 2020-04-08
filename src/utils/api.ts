import { useEffect, useState } from 'react'
import fetch from 'isomorphic-fetch'

const useAPICall = <R>(url: string) => {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<R | undefined>(undefined)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        const res = await fetch(url)

        if (!cancelled) {
          if (res.status !== 200) {
            setError('Bad response status')
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

interface IGithubIssue {
  title: string
  url: string
  comments: number
  date: string
}

interface IGithubIssuesResponse {
  issues: Array<IGithubIssue>
}

export function useIssues() {
  const response = useAPICall<IGithubIssuesResponse>('/api/github')

  return { ...response, result: response.result?.issues }
}

interface IDiscussTopic {
  title: string
  comments: number
  date: string
  url: string
}

interface IDiscussTopicsResponse {
  topics: Array<IDiscussTopic>
}

export function useTopics() {
  const response = useAPICall<IDiscussTopicsResponse>('/api/discourse')

  return { ...response, result: response.result?.topics }
}

interface IDiscussCommentsCountResponse {
  count: number
}

export function useCommentsCount(commentsUrl: string) {
  const response = useAPICall<IDiscussCommentsCountResponse>(
    `/api/comments?url=${commentsUrl}`
  )

  return { ...response, result: response.result?.count }
}
