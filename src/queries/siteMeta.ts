import { useStaticQuery, graphql } from 'gatsby'

export default function siteMeta() {
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
