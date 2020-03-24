import React from 'react'

import { IPageInfo } from '../Paginator'
import PageContent from '../PageContent'
import BlogFeed, { IBlogFeedPostList } from '../BlogFeed'
import Subscribe from '../Subscribe'

interface IBlogHomeProps {
  posts: IBlogFeedPostList
  pageInfo: IPageInfo
}

const BlogHome: React.SFC<IBlogHomeProps> = ({ posts, pageInfo }) => {
  return (
    <>
      <PageContent>
        <BlogFeed
          feedPostList={posts}
          pageInfo={pageInfo}
          header="Data Version Control in Real Life"
          leadParagraph={
            <>
              We write about machine learning workflow. From data versioning and
              processing to model productionization. We share our news,
              findings, interesting reads, community takeaways.
            </>
          }
        />
      </PageContent>
      <Subscribe />
    </>
  )
}

export default BlogHome
