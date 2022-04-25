import React from 'react'

import { IPaginatorPageInfo } from '../../Paginator'
import PageContent from '../../PageContent'
import Feed, { IBlogFeedPostList } from '../Feed'
import SubscribeSection from '../../SubscribeSection'
import config from '../../../config'
import Search from '../Search'

const searchIndices = [{ name: config.algolia.indexName, title: `Blogs` }]
interface IBlogHomeProps {
  posts: IBlogFeedPostList
  pageInfo: IPaginatorPageInfo
}

const Home: React.FC<IBlogHomeProps> = ({ posts, pageInfo }) => {
  return (
    <>
      <Search indices={searchIndices} />
      <PageContent>
        <Feed
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
      <SubscribeSection />
    </>
  )
}

export default Home
