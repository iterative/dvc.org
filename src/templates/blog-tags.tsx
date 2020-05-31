// Components
import { graphql } from 'gatsby'
import React from 'react'

import {
  IPaginatorLocationContextValue,
  PaginatorLocationContext
} from '../components/Paginator/LocationContext'
import SEO from '../components/SEO'
import { IPaginatorContext } from '../components/Paginator'
import BlogTags from '../components/Blog/Tags'
import { IBlogFeedPostList } from '../components/Blog/Feed'

interface IBlogTagsPageData {
  data: { posts: IBlogFeedPostList }
  location: IPaginatorLocationContextValue
  pageContext: {
    tag: string
  } & IPaginatorContext
}

const BlogTagsPage: React.FC<IBlogTagsPageData> = ({
  data,
  location,
  pageContext: { tag, humanPageNumber, nextPagePath, previousPagePath }
}) => {
  const title = `Posts tagged with "${tag}"`

  return (
    <PaginatorLocationContext.Provider value={location}>
      <SEO
        title={title}
        defaultMetaTitle={true}
        pageInfo={{ currentPage: humanPageNumber }}
      />
      <BlogTags
        posts={data.posts}
        header={title}
        nextPage={nextPagePath}
        previousPage={previousPagePath}
        currentPage={humanPageNumber}
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
