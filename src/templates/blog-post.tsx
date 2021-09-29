import { graphql } from 'gatsby'
import { getSrc, IGatsbyImageData } from 'gatsby-plugin-image'
import React from 'react'

import SEO from '../components/SEO'
import Post from '../components/Blog/Post'

import { ISocialIcon } from '../components/SocialIcon'

export interface IBlogPostHeroPic {
  picture?: IGatsbyImageData
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
  picture?: IGatsbyImageData
  pictureComment?: string
  author: {
    name: string
    avatar: {
      gatsbyImageData: IGatsbyImageData
    }
    links: Array<ISocialIcon>
  }
}

interface IBlogPostPageProps {
  data: {
    blogPost: IBlogPostData
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
        image={picture && getSrc(picture)}
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
      slug
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
        links {
          url
          site
        }
        avatar {
          gatsbyImageData(
            width: 40
            height: 40
            transformOptions: { cropFocus: CENTER }
            layout: FIXED
          )
        }
      }
      picture {
        gatsbyImageData(width: 850, quality: 90)
      }
      pictureComment
    }
  }
`
