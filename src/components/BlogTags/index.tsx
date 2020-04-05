import React from 'react'

import { IPaginatorPageInfo } from '../Paginator'
import PageContent from '../PageContent'
import BlogFeed, { IBlogFeedPostList } from '../BlogFeed'
import Subscribe from '../Subscribe'

interface IBlogTagsProps {
  posts: IBlogFeedPostList
  pageInfo: IPaginatorPageInfo
  header: string
}

const BlogTags: React.SFC<IBlogTagsProps> = ({ posts, pageInfo, header }) => {
  return (
    <>
      <PageContent>
        <BlogFeed
          feedPostList={posts}
          pageInfo={pageInfo}
          bigFirst={false}
          header={header}
        />
      </PageContent>
      <Subscribe />
    </>
  )
}

export default BlogTags
