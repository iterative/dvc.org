import { graphql } from 'gatsby'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import React from 'react'

import SEO from '@dvcorg/gatsby-theme-iterative/src/components/SEO'
import Post from '../components/Blog/Post'

import { ISocialIcon } from '@dvcorg/gatsby-theme-iterative/src/components/SocialIcon'
import { isProduction } from '../server/utils'

export interface IBlogPostHeroPic {
  picture?: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
  }
  pictureComment?: string
}

export interface IBlogPostData {
  id: string
  htmlAst: Node
  timeToRead: string
  slug: string
  title: string
  date: string
  description: string
  descriptionLong?: string
  commentsUrl?: string
  tags?: string[]
  picture?: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
      fields: { sourcePath: string }
    }
  }
  pictureComment?: string
  author: {
    name: string
    avatar: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
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
  const {
    title,
    description,
    picture,
    author: { name },
    date
  } = post
  return (
    <>
      <SEO
        title={title}
        description={description}
        image={
          picture &&
          (isProduction
            ? `/blog/${picture.childImageSharp.fields.sourcePath}`
            : picture.childImageSharp.gatsbyImageData)
        }
        imageHeight={picture?.childImageSharp.gatsbyImageData.height}
        imageWidth={picture?.childImageSharp.gatsbyImageData.width}
        meta={[
          {
            name: 'twitter:card',
            content: 'summary_large_image'
          },
          {
            name: 'og:type',
            content: 'article'
          },
          {
            name: 'article:author',
            content: name
          },
          {
            name: 'article:published_time',
            content: new Date(date).toISOString().slice(0, 10)
          }
        ]}
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
      htmlAst
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
          childImageSharp {
            gatsbyImageData(
              width: 40
              height: 40
              transformOptions: { cropFocus: CENTER }
              layout: FIXED
            )
          }
        }
      }
      picture {
        childImageSharp {
          fields {
            sourcePath
          }
          gatsbyImageData(width: 850, quality: 90)
        }
      }
      pictureComment
    }
  }
`
