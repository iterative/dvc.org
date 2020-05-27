import { useEffect, useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import fetch from 'isomorphic-fetch'

export default function useStars(): number {
  // Get the amount of stars from build time
  const staticStars = useStaticQuery(graphql`
    query GithubStarsQuery {
      githubData {
        data {
          repository {
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  `).githubData.data.repository.stargazers.totalCount

  // Maintain an updatable state so we can update stars on delivery
  const [stars, setStars] = useState(staticStars)

  // Run an IIFE to update from the server on the client side.
  useEffect(() => {
    ;(async (): undefined => {
      const res = await fetch(`/api/github/stars?current=${stars}`)
      if (res.status === 200) {
        const json = await res.json()
        setStars(json.stars)
      }
    })()
  }, [])

  return stars
}
