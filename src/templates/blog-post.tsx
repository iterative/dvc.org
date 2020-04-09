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

export interface IBlogPostFrontmatter {
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

export interface IBlogPostData {
  id: string
  html: string
  timeToRead: string
  fields: {
    slug: string
  }
  frontmatter: IBlogPostFrontmatter
}

interface IBlogPostPageProps {
  data: {
    markdownRemark: IBlogPostData
  }
  pageContext: {
    next: IBlogPostData
    previous: IBlogPostData
  }
}

const BlogPostPage: React.SFC<IBlogPostPageProps> = ({ data }) => {
  const post = data.markdownRemark

  return (
    <>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        image={
          post.frontmatter.picture &&
          post.frontmatter.picture.childImageSharp.fluid.src
        }
      />
      <Post {...post} />
    </>
  )
}

export default BlogPostPage

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(format: HTML)
      html
      timeToRead
      fields {
        slug
      }
      frontmatter {
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
              presentationWidth
            }
          }
        }
        pictureComment
      }
    }
  }
`
