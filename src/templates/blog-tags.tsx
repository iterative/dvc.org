// Components
import { graphql } from 'gatsby'
import React from 'react'

import {
  IPaginatorLocationContextValue,
  PaginatorLocationContext
} from '../components/Paginator/LocationContext'
import SEO from '../components/SEO'
import { IPageInfo } from '../components/Paginator'
import BlogTags from '../components/BlogTags'
import { IBlogFeedPostList } from '../components/BlogFeed'

interface IBlogTagsPageData {
  data: { posts: IBlogFeedPostList }
  location: IPaginatorLocationContextValue
  pageContext: {
    tag: string
    pageInfo: IPageInfo
  }
}

const BlogTagsPage: React.SFC<IBlogTagsPageData> = ({
  data,
  pageContext,
  location
}) => {
  const title = `Posts tagged with "${pageContext.tag}"`

  return (
    <PaginatorLocationContext.Provider value={location}>
      <SEO
        title={title}
        defaultMetaTitle={true}
        pageInfo={pageContext.pageInfo}
      />
      <BlogTags
        pageInfo={pageContext.pageInfo}
        posts={data.posts}
        header={title}
      />
    </PaginatorLocationContext.Provider>
  )
}

export default BlogTagsPage

export const pageQuery = graphql`
  query($tag: String, $skip: Int, $limit: Int) {
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
      skip: $skip
      limit: $limit
    ) {
      ...FeedPostList
    }
  }
`
