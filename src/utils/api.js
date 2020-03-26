import { useEffect, useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import fetch from 'isomorphic-fetch'

export function makeAbsoluteURL(req, uri) {
  const host = req ? req.headers['host'] : window.location.host
  const protocol = host.indexOf('localhost') > -1 ? 'http:' : 'https:'

  return `${protocol}//${host}${uri}`
}

const useAPICall = url => {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)
  const [result, setResult] = useState(undefined)

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

export function useIssues() {
  const { error, ready, result } = useAPICall('/api/github')

  return { error, ready, result: result && result.issues }
}

export function usePosts() {
  const {
    allMarkdownRemark: { edges }
  } = useStaticQuery(graphql`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: { fileAbsolutePath: { regex: "/content/blog/" } }
        limit: 3
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              date
              commentsUrl
              picture {
                childImageSharp {
                  resize(
                    width: 160
                    height: 160
                    fit: COVER
                    cropFocus: CENTER
                  ) {
                    src
                  }
                }
              }
            }
          }
        }
      }
    }
  `)

  return edges.map(
    ({
      node: {
        fields: { slug },
        frontmatter: { title, date, commentsUrl, picture }
      }
    }) => {
      let pictureUrl = null

      if (picture) {
        const {
          childImageSharp: {
            resize: { src }
          }
        } = picture

        pictureUrl = src
      }

      return {
        commentsUrl,
        date,
        pictureUrl,
        title,
        url: slug
      }
    }
  )
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
