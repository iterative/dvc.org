import React from 'react'

import { IPaginatorPageInfo } from '../../Paginator'
import PageContent from '../../PageContent'
import Feed, { IBlogFeedPostList } from '../Feed'
import SubscribeSection from '../../SubscribeSection'

interface IBlogTagsProps {
  posts: IBlogFeedPostList
  pageInfo: IPaginatorPageInfo
  header: string
}

const Tags: React.FC<IBlogTagsProps> = ({ posts, pageInfo, header }) => {
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
      <SubscribeSection />
    </>
  )
}

export default Tags
