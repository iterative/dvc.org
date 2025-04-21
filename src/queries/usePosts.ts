import { useStaticQuery, graphql } from 'gatsby'
import { getSrc, IGatsbyImageData } from 'gatsby-plugin-image'
import { IGatsbyImageDataParent } from 'gatsby-plugin-image/dist/src/components/hooks'

export interface IFeedPostData {
  link: string
  title: string
  pubDate: string
  comments?: string
  picture?: {
    relativePath: string
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }
}

interface IResultBlogPostData {
  comments?: string
  date: string
  pictureUrl?: string
  title: string
  url: string
}

export default function usePosts(): Array<IResultBlogPostData> {
  const { allFeedIterativeBlog } = useStaticQuery(graphql`
    query Posts {
      allFeedIterativeBlog(sort: { isoDate: DESC }, limit: 3) {
        nodes {
          link
          title
          pubDate
          picture {
            childImageSharp {
              gatsbyImageData(
                width: 160
                height: 160
                transformOptions: { fit: COVER, cropFocus: CENTER }
              )
            }
          }
          comments
        }
      }
    }
  `)
  const nodes: Array<IFeedPostData> = allFeedIterativeBlog.nodes

  return nodes.map(({ link, title, pubDate, comments, picture }) => {
    return {
      commentsUrl: comments,
      date: pubDate,
      pictureUrl:
        picture && getSrc(picture.childImageSharp as IGatsbyImageDataParent),
      title,
      url: link
    }
  })
}
