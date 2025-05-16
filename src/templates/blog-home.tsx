import { graphql, HeadProps, PageProps } from 'gatsby'

import Feed, { IBlogFeedPostList } from '@/components/Blog/Feed'
import BlogLayout from '@/components/Blog/Layout'
import { IPaginatorPageInfo } from '@/components/Blog/Paginator'
import {
  IPaginatorLocationContextValue,
  PaginatorLocationContext
} from '@/components/Blog/Paginator/LocationContext'
import SEO from '@/components/SEO'

interface IBlogHomePageProps {
  data: { posts: IBlogFeedPostList }
  location: PageProps['location']
  paginatorLocation: IPaginatorLocationContextValue
  pageContext: {
    pageInfo: IPaginatorPageInfo
  }
}

const BlogHomePage = ({
  data,
  paginatorLocation,
  location,
  pageContext
}: IBlogHomePageProps) => {
  return (
    <PaginatorLocationContext.Provider value={paginatorLocation}>
      <BlogLayout location={location}>
        <Feed
          feedPostList={data.posts}
          pageInfo={pageContext.pageInfo}
          header="Data Version Control Blog"
          leadParagraph={
            <>
              Insights and updates from the DVC team. Explore best practices in
              data versioning, machine learning workflows, and model management.
              Stay informed with our latest news, tutorials, and community
              highlights.
            </>
          }
        />
      </BlogLayout>
    </PaginatorLocationContext.Provider>
  )
}

export default BlogHomePage

const keywords = [
  `git`,
  `data`,
  `version control`,
  `machine learning models management`,
  `datasets`
]
const description =
  `We write about machine learning workflow. ` +
  `From data versioning and processing to model productionization. We share ` +
  `our news, findings, interesting reads, community takeaways.`

export const Head = ({
  pageContext,
  location
}: IBlogHomePageProps & HeadProps) => (
  <>
    <SEO
      pathname={location.pathname}
      title="Blog | DVC"
      description={description}
      keywords={keywords}
      pageInfo={pageContext?.pageInfo}
    />
  </>
)

export const pageQuery = graphql`
  query ($skip: Int, $limit: Int) {
    posts: allBlogPost(sort: { date: DESC }, skip: $skip, limit: $limit) {
      ...FeedPostList
    }
  }
`
