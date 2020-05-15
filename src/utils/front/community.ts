import { useMemo } from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import { ICommunitySection } from '../../components/Community/Section'
import { IEvent } from '../../components/Community/Events'
import { IHero } from '../../components/Community/Hero'
import {
  ICommunityUserContentProps,
  ICommunityDocumentationProps
} from '../../components/Community/Learn'

export interface ICommunityData {
  rest: {
    documentation: Array<ICommunityDocumentationProps>
    userContent: Array<ICommunityUserContentProps>
    stats: {
      users: string
      messages: string
    }
    section: {
      contribute: ICommunitySection
      events: ICommunitySection
      documentation: ICommunitySection
      userContent: ICommunitySection
      learn: ICommunitySection
      meet: ICommunitySection
    }
  }
  hero: IHero
  events: Array<IEvent | null> | null
}

export function useCommunityData(): ICommunityData {
  const data = useStaticQuery(graphql`
    query CommunityDataQuery {
      rest: communityRest {
        content
      }
      hero: allCommunityHero(
        sort: { fields: [sourceIndex], order: ASC }
        limit: 1
        filter: { expired: { eq: false } }
      ) {
        nodes {
          pictureDesktop
          pictureMobile
          url
        }
      }
      events: allCommunityEvent(
        filter: { expired: { eq: false } }
        sort: { fields: [sourceIndex], order: ASC }
        limit: 3
      ) {
        nodes {
          date
          title
          url
          description
          city
          pictureUrl
        }
      }
    }
  `)
  return useMemo(
    (): ICommunityData => ({
      rest: data.rest.content,
      hero: data.hero.nodes[0],
      // Return null if there are no items
      // Otherwise, pad arrays shorter than 3 items with null
      events:
        data.events.nodes.length > 0
          ? [0, 1, 2].map(i => data.events.nodes[i] || null)
          : null
    }),
    [data]
  )
}
