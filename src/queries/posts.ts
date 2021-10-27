import { useStaticQuery, graphql } from 'gatsby'
import { getSrc } from 'gatsby-plugin-image'
import { IGatsbyImageDataParent } from 'gatsby-plugin-image/dist/src/components/hooks'

import { IBlogPostData } from '../templates/blog-post'

interface IResultBlogPostData {
  commentsUrl?: string
  date: string
  pictureUrl?: string
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
            gatsbyImageData(
              width: 160
              height: 160
              transformOptions: { fit: COVER, cropFocus: CENTER }
            )
          }
        }
      }
    }
  `)
  const nodes: Array<IBlogPostData> = allBlogPost.nodes

  return nodes.map(({ slug, title, date, commentsUrl, picture }) => {
    return {
      commentsUrl,
      date,
      pictureUrl: getSrc(picture as IGatsbyImageDataParent),
      title,
      url: slug
    }
  })
}
