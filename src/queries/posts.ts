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
  const { allBlogPost } = useStaticQuery(graphql`
    query Posts {
      allBlogPost(sort: { fields: [date], order: DESC }, limit: 3) {
        nodes {
          slug
          title
          date
          commentsUrl
          picture {
            resize(width: 160, height: 160, fit: COVER, cropFocus: CENTER) {
              src
            }
          }
        }
      }
    }
  `)
  const nodes: Array<IBlogPostData> = allBlogPost.nodes

  return nodes.map(({ slug, title, date, commentsUrl, picture }) => {
    let pictureUrl = null

    if (picture) {
      const {
        resize: { src }
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
  })
}
