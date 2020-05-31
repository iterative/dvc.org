import React from 'react'

import { IPaginatorPageInfo } from '../../Paginator'
import PageContent from '../../PageContent'
import Feed, { IBlogFeedPostList } from '../Feed'
import SubscribeSection from '../../SubscribeSection'

interface IBlogTagsProps extends IPaginatorPageInfo {
  posts: IBlogFeedPostList
  header: string
}

const Tags: React.FC<IBlogTagsProps> = ({
  posts,
  header,
  nextPage,
  previousPage,
  currentPage
}) => {
  return (
    <>
      <PageContent>
        <Feed
          feedPostList={posts}
          pageInfo={{ nextPage, previousPage, currentPage }}
          bigFirst={false}
          header={header}
        />
      </PageContent>
      <SubscribeSection />
    </>
  )
}

export default Tags
