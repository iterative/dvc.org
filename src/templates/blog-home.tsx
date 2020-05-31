import { graphql } from 'gatsby'
import React from 'react'

import {
  IPaginatorLocationContextValue,
  PaginatorLocationContext
} from '../components/Paginator/LocationContext'
import BlogHome from '../components/Blog/Home'
import { IBlogFeedPostList } from '../components/Blog/Feed'
import { IPaginatorContext } from '../components/Paginator'

interface IBlogHomePageProps {
  data: { posts: IBlogFeedPostList }
  location: IPaginatorLocationContextValue
  pageContext: IPaginatorContext
}

const BlogHomePage: React.FC<IBlogHomePageProps> = ({
  data,
  location,
  pageContext: { nextPagePath, previousPagePath, humanPageNumber }
}) => {
  return (
    <PaginatorLocationContext.Provider value={location}>
      <BlogHome
        posts={data.posts}
        nextPage={nextPagePath}
        previousPage={previousPagePath}
        currentPage={humanPageNumber}
      />
    </PaginatorLocationContext.Provider>
  )
}

export default BlogHomePage

export const pageQuery = graphql`
  query($skip: Int, $limit: Int) {
    posts: allBlogPost(
      sort: { fields: [date], order: DESC }
      skip: $skip
      limit: $limit
    ) {
      ...FeedPostList
    }
  }
`
