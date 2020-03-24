import { graphql } from 'gatsby'
import React from 'react'

import {
  IPaginatorLocationContextValue,
  PaginatorLocationContext
} from '../components/Paginator/LocationContext'
import SEO from '../components/SEO'
import BlogHome from '../components/BlogHome'
import { IPageInfo } from '../components/Paginator'
import { IBlogFeedPostList } from '../components/BlogFeed'

interface IBlogHomePageProps {
  data: { posts: IBlogFeedPostList }
  location: IPaginatorLocationContextValue
  pageContext: {
    pageInfo: IPageInfo
  }
}

const BlogHomePage: React.SFC<IBlogHomePageProps> = ({
  data,
  location,
  pageContext
}) => {
  return (
    <PaginatorLocationContext.Provider value={location}>
      <SEO
        title="Blog"
        defaultMetaTitle={true}
        pageInfo={pageContext.pageInfo}
      />
      <BlogHome posts={data.posts} pageInfo={pageContext.pageInfo} />
    </PaginatorLocationContext.Provider>
  )
}

export default BlogHomePage

export const pageQuery = graphql`
  query($skip: Int, $limit: Int) {
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "/content/blog/" } }
      skip: $skip
      limit: $limit
    ) {
      ...FeedPostList
    }
  }
`
