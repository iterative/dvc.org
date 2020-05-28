import { graphql } from 'gatsby'
import React from 'react'

import {
  IPaginatorLocationContextValue,
  PaginatorLocationContext
} from '../components/Paginator/LocationContext'
import AuthorPage from '../components/Blog/Author'
import { IBlogFeedPostList } from '../components/Blog/Feed'
import { FixedObject } from 'gatsby-image'

interface IAuthorData {
  posts: IBlogFeedPostList
  name: string
  links: Array<string>
  html: string
  avatar: {
    fixed: FixedObject
  }
}

interface IBlogAuthorPageProps {
  data: {
    author: IAuthorData
  }
  location: IPaginatorLocationContextValue
}

const BlogAuthorPage: React.FC<IBlogAuthorPageProps> = ({ data, location }) => {
  const { posts, name, links, html, avatar } = data.author

  return (
    <PaginatorLocationContext.Provider value={location}>
      <AuthorPage
        posts={posts}
        name={name}
        body={html}
        link={links[0]}
        avatar={avatar}
      />
    </PaginatorLocationContext.Provider>
  )
}

export default BlogAuthorPage

export const pageQuery = graphql`
  query AuthorPage($id: String!) {
    author(id: { eq: $id }) {
      name
      links
      html
      avatar {
        fixed(width: 100, height: 100) {
          ...GatsbyImageSharpFixed
        }
      }
      posts {
        nodes {
          ...FeedPost
        }
      }
    }
  }
`
