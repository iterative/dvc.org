import { graphql } from 'gatsby'
import React from 'react'

import {
  IPaginatorLocationContextValue,
  PaginatorLocationContext
} from '../components/Paginator/LocationContext'
import AuthorPage from '../components/Blog/Author'
import { IBlogFeedPostList } from '../components/Blog/Feed'

interface IAuthorData {
  posts: IBlogFeedPostList
  name: string
  link: string
}

interface IBlogAuthorPageProps {
  data: {
    author: IAuthorData
  }
  location: IPaginatorLocationContextValue
}

const BlogAuthorPage: React.FC<IBlogAuthorPageProps> = ({ data, location }) => {
  const { posts, name, link } = data.author

  return (
    <PaginatorLocationContext.Provider value={location}>
      <AuthorPage posts={posts} header={name} leadParagraph={link} />
    </PaginatorLocationContext.Provider>
  )
}

export default BlogAuthorPage

export const pageQuery = graphql`
  query AllAuthorBuilderQuery($id: String!) {
    author(id: { eq: $id }) {
      name
      link
      posts {
        nodes {
          ...FeedPost
        }
      }
    }
  }
`
