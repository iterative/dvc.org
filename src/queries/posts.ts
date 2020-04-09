import { useStaticQuery, graphql } from 'gatsby'

import { IBlogPostData } from '../templates/blog-post'

interface IResultBlogPostData {
  commentsUrl?: string
  date: string
  pictureUrl: string | null
  title: string
  url: string
}

export default function posts(): Array<IResultBlogPostData> {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    query Posts {
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
  const edges: Array<{
    node: IBlogPostData
  }> = allMarkdownRemark.edges

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
