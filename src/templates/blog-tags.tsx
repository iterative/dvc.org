// Components
import { graphql } from 'gatsby'
import React from 'react'

import {
  IPaginatorLocationContextValue,
  PaginatorLocationContext
} from '../components/Paginator/LocationContext'
import SEO from '../components/SEO'
import { IPaginatorPageInfo } from '../components/Paginator'
import BlogTags from '../components/Blog/Tags'
import { IBlogFeedPostList } from '../components/Blog/Feed'

interface IBlogTagsPageData {
  data: { posts: IBlogFeedPostList }
  location: IPaginatorLocationContextValue
  pageContext: {
    tag: string
    pageInfo: IPaginatorPageInfo
  }
}

const BlogTagsPage: React.FC<IBlogTagsPageData> = ({
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
    posts: allBlogPost(
      sort: { fields: [date], order: DESC }
      filter: { tags: { in: [$tag] } }
      skip: $skip
      limit: $limit
    ) {
      ...FeedPostList
    }
  }
`
