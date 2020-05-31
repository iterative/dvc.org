import React from 'react'

import { IPaginatorPageInfo } from '../../Paginator'
import PageContent from '../../PageContent'
import Feed, { IBlogFeedPostList } from '../Feed'
import SubscribeSection from '../../SubscribeSection'

interface IBlogHomeProps extends IPaginatorPageInfo {
  posts: IBlogFeedPostList
}

const Home: React.FC<IBlogHomeProps> = ({
  posts,
  previousPage,
  nextPage,
  currentPage
}) => {
  return (
    <>
      <PageContent>
        <Feed
          feedPostList={posts}
          pageInfo={{ previousPage, nextPage, currentPage }}
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
      <SubscribeSection />
    </>
  )
}

export default Home
