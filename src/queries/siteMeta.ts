import { useStaticQuery, graphql } from 'gatsby'

interface ISiteMeta {
  title: string
  description: string
  keywords: string
  siteUrl: string
}

export default function siteMeta(): ISiteMeta {
  const {
    site: { siteMetadata }
  } = useStaticQuery(
    graphql`
      query SiteMetadata {
        site {
          siteMetadata {
            title
            description
            keywords
            siteUrl
          }
        }
      }
    `
  )

  return siteMetadata
}
