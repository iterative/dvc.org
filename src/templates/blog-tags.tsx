import { HeadProps, PageProps, graphql } from 'gatsby'

import BackSection from '@/components/BackSection'
import Feed, { IBlogFeedPostList } from '@/components/Blog/Feed'
import BlogLayout from '@/components/Blog/Layout'
import PageContent from '@/components/Blog/PageContent'
import { IPaginatorPageInfo } from '@/components/Blog/Paginator'
import {
  IPaginatorLocationContextValue,
  PaginatorLocationContext
} from '@/components/Blog/Paginator/LocationContext'
import SEO from '@/components/SEO'

import { blogsPageLink } from '@/constants/internalLinks'

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
          <BackSection link={blogsPageLink} section="top">
            Back to blogs
          </BackSection>
          <div className="flex w-full items-center justify-center rounded bg-slate-200 p-4 text-gray-900">
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
