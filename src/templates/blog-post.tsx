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
    fluid: IFluidObject
  }
  pictureComment?: string
}

export interface IBlogPostData {
  id: string
  html: string
  timeToRead: string
  slug: string
  title: string
  date: string
  description: string
  descriptionLong?: string
  commentsUrl?: string
  tags?: string[]
  picture?: {
    fluid: IFluidObject
    resize: {
      src: string
    }
  }
  pictureComment?: string
  author: {
    name: string
    avatar: {
      fixed: FixedObject
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
        image={picture && picture.fluid.src}
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
      html
      timeToRead
      title
      date(formatString: "MMMM DD, YYYY")
      description
      descriptionLong
      tags
      commentsUrl
      author {
        name
        avatar {
          fixed(width: 40, height: 40, quality: 50, cropFocus: CENTER) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
      picture {
        fluid(maxWidth: 850) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
      pictureComment
    }
  }
`
