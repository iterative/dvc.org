import { graphql } from 'gatsby'
import React from 'react'

import { PaginatorLocationContext } from '../components/Paginator/LocationContext'
import AuthorPage from '../components/Blog/Author'
import { IBlogFeedPostList } from '../components/Blog/Feed'
import { FixedObject } from 'gatsby-image'

import { ISocialIcon } from '../components/SocialIcon'

interface IAuthorData {
  posts: IBlogFeedPostList
  name: string
  links: Array<ISocialIcon>
  html: string
  avatar: {
    fixed: FixedObject
  }
}

interface IBlogAuthorPageProps {
  data: {
    author: IAuthorData
  }
}

const BlogAuthorPage: React.FC<IBlogAuthorPageProps> = ({
  data,
  location,
  pageContext: { previousPagePath, nextPagePath }
}) => {
  const {
    author: { name, links, html, avatar },
    posts
  } = data

  return (
    <PaginatorLocationContext.Provider value={location}>
      <AuthorPage
        posts={posts}
        name={name}
        body={html}
        links={links}
        avatar={avatar}
        previousPage={previousPagePath}
        nextPage={nextPagePath}
      />
    </PaginatorLocationContext.Provider>
  )
}

export default BlogAuthorPage

export const pageQuery = graphql`
  query AuthorPage($id: String!, $limit: Int!, $skip: Int!) {
    author(id: { eq: $id }) {
      name
      html
      avatar {
        fixed(width: 100, height: 100) {
          ...GatsbyImageSharpFixed
        }
      }
      links {
        url
        site
      }
    }
    posts: allBlogPost(
      filter: { author: { id: { eq: $id } } }
      limit: $limit
      skip: $skip
      sort: { fields: date, order: DESC }
    ) {
      totalCount
      nodes {
        ...FeedPost
      }
    }
  }
`
