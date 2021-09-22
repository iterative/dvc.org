import { useStaticQuery, graphql } from 'gatsby'

interface ISiteMeta {
  title: string
  description: string
  keywords: string
  siteUrl: string
}

export default function siteMeta(): ISiteMeta {
  const { allFile: nodes } = useStaticQuery(
    graphql`
      query TestQuery {
        allFile(limit: 1) {
          nodes {
            absolutePath
          }
        }
      }
    `
  )
  console.log(nodes)

  return {
    title: 'title',
    description: 'description',
    keywords: 'keywords',
    siteUrl: 'https://dvc.org'
  }
}
