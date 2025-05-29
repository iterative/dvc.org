import { useStaticQuery, graphql } from 'gatsby'

interface ISiteMeta {
  title: string
  description: string
  keywords: string
  siteUrl: string
  titleTemplate: string
  imageAlt?: string
  plausibleDomain: string | null
  plausibleSrc: string | null
  plausibleAPI: string | null
  twitterUsername?: string
}

export default function useSiteMeta(): ISiteMeta {
  const {
    site: { siteMetadata }
  } = useStaticQuery(graphql`
    query SiteMetadata {
      site {
        siteMetadata {
          title
          description
          keywords
          siteUrl
          titleTemplate
          imageAlt
          plausibleDomain
          plausibleSrc
          plausibleAPI
          twitterUsername
        }
      }
    }
  `)

  return siteMetadata
}
