import { HeadProps, PageProps, graphql } from 'gatsby'

import Feed, { IBlogFeedPostList } from '@/components/Blog/Feed'
import BlogLayout from '@/components/Blog/Layout'
import PageContent from '@/components/Blog/PageContent'
import { IPaginatorPageInfo } from '@/components/Blog/Paginator'
import {
  IPaginatorLocationContextValue,
  PaginatorLocationContext
} from '@/components/Blog/Paginator/LocationContext'
import SEO from '@/components/SEO'

interface IBlogTagsPageData {
  data: { posts: IBlogFeedPostList }
  paginatorLocation: IPaginatorLocationContextValue
  pageContext: {
    tag: string
    pageInfo: IPaginatorPageInfo
  }
  location: PageProps['location']
}

const BlogTagsPage: React.FC<IBlogTagsPageData> = ({
  data,
  pageContext,
  paginatorLocation,
  location
}) => {
  return (
    <BlogLayout location={location}>
      <PaginatorLocationContext.Provider value={paginatorLocation}>
        <PageContent>
          <div className="flex w-full items-center justify-center rounded bg-slate-900 p-4 text-gray-100">
            <h1 className="text-4xl font-medium">{pageContext.tag}</h1>
          </div>
          <Feed
            feedPostList={data.posts}
            pageInfo={pageContext.pageInfo}
            bigFirst={false}
          />
        </PageContent>
      </PaginatorLocationContext.Provider>
    </BlogLayout>
  )
}

export default BlogTagsPage

export const Head = ({
  pageContext,
  location
}: IBlogTagsPageData & HeadProps) => (
  <>
    <SEO
      pathname={location.pathname}
      title={`All  ${pageContext.tag} posts`}
      pageInfo={pageContext.pageInfo}
    />
  </>
)

export const pageQuery = graphql`
  query ($tag: String, $skip: Int, $limit: Int) {
    posts: allBlogPost(
      sort: { date: DESC }
      filter: { tags: { in: [$tag] } }
      skip: $skip
      limit: $limit
    ) {
      ...FeedPostList
    }
  }
`
