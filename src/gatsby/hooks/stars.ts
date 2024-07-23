import { useEffect, useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import fetch from 'isomorphic-fetch'
import * as Sentry from '@sentry/gatsby'

export default function useStars(repo = 'dvc'): number | null {
  // Get the amount of stars from build time
  const staticStars = useStaticQuery(graphql`
    query GithubStarsQuery {
      staticGithubData {
        stars
      }
    }
  `).staticGithubData.stars

  const defaultStars = repo === 'dvc' ? staticStars : null
  // Maintain an updatable state so we can update stars on delivery
  const [stars, setStars] = useState(defaultStars)

  // Run an IIFE to update from the server on the client side.
  useEffect(() => {
    ;(async (): Promise<void> => {
      try {
        const res = await fetch(`/api/github/stars?repo=${repo}`)

        if (res.status === 200) {
          const json = await res.json()
          setStars(json.stars)
        } else {
          Sentry.captureMessage(
            `Stars update response status was ${res.status}! Using static value.`
          )
          setStars(defaultStars)
        }
      } catch (error) {
        Sentry.captureException(error)
        setStars(defaultStars)
      }
    })()
  }, [])

  return stars
}
