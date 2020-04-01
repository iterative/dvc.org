import React from 'react'

import { IPaginatorPageInfo } from '../../Paginator'
import PageContent from '../../PageContent'
import Feed, { IBlogFeedPostList } from '../Feed'
import Subscribe from '../../Subscribe'

interface IBlogTagsProps {
  posts: IBlogFeedPostList
  pageInfo: IPaginatorPageInfo
  header: string
}

const Tags: React.SFC<IBlogTagsProps> = ({ posts, pageInfo, header }) => {
  return (
    <>
      <PageContent>
        <Feed
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

export default Tags
