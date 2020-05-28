import { useEffect, useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import fetch from 'isomorphic-fetch'

export default function useStars(): number | null {
  // Get the amount of stars from build time
  const staticStars = useStaticQuery(graphql`
    query GithubStarsQuery {
      staticGithubData {
        stars
      }
    }
  `).staticGithubData.stars

  // Maintain an updatable state so we can update stars on delivery
  const [stars, setStars] = useState(null)

  // Run an IIFE to update from the server on the client side.
  useEffect(() => {
    ;(async (): Promise<void> => {
      const res = await fetch(`/api/github/stars`)
      if (res.status === 200) {
        const json = await res.json()
        setStars(json.stars)
      } else {
        console.warn(
          `Stars update response status was ${res.status}! Using static value.`
        )
        setStars(staticStars)
      }
    })()
  }, [])

  return stars
}
