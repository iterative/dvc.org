import { FixedObject, FluidObject, GatsbyImageProps } from 'gatsby-image'

import { graphql } from 'gatsby'
import React from 'react'

import SEO from '../components/SEO'
import Post from '../components/Blog/Post'

interface IFluidObject extends FluidObject {
  presentationWidth?: number
}

export interface IGatsbyImageProps extends GatsbyImageProps {
  fluid?: IFluidObject
}

export interface IBlogPostHeroPic {
  picture?: {
    childImageSharp: {
      fluid: IFluidObject
    }
  }
  pictureComment?: string
}

export interface IBlogPostData {
  id: string
  parent: {
    html: string
    timeToRead: string
  }
  slug: string
  title: string
  date: string
  description: string
  descriptionLong?: string
  commentsUrl?: string
  tags?: string[]
  picture?: {
    childImageSharp: {
      fluid: IFluidObject
      resize: {
        src: string
      }
    }
  }
  pictureComment?: string
  author: {
    childMarkdownRemark: {
      frontmatter: {
        name: string
        avatar: {
          childImageSharp: {
            fixed: FixedObject
          }
        }
      }
    }
  }
}

interface IBlogPostPageProps {
  data: {
    blogPost: IBlogPostData
  }
  pageContext: {
    next: IBlogPostData
    previous: IBlogPostData
  }
}

const BlogPostPage: React.FC<IBlogPostPageProps> = ({ data }) => {
  const post = data.blogPost
  const { title, description, picture } = post

  return (
    <>
      <SEO
        title={title}
        description={description}
        image={picture && picture.childImageSharp.fluid.src}
      />
      <Post {...post} />
    </>
  )
}

export default BlogPostPage

export const pageQuery = graphql`
  query BlogPostPage($id: String!) {
    blogPost(id: { eq: $id }) {
      id
      parent {
        ... on MarkdownRemark {
          html
          timeToRead
        }
      }
      title
      date(formatString: "MMMM DD, YYYY")
      description
      descriptionLong
      tags
      commentsUrl
      author {
        childMarkdownRemark {
          frontmatter {
            name
            avatar {
              childImageSharp {
                fixed(width: 40, height: 40, quality: 50, cropFocus: CENTER) {
                  ...GatsbyImageSharpFixed_withWebp
                }
              }
            }
          }
        }
      }
      picture {
        childImageSharp {
          fluid(maxWidth: 850) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
      pictureComment
    }
  }
`
