import React from 'react'
import SEO from '../SEO'
import MainLayout, { LayoutComponent } from '../MainLayout'

const keywords =
  'git, data, version control, machine learning models management, datasets'
const description =
  'Data Version Control Blog. We write about machine learning workflow. From data versioning and processing to model productionization. We share our news, findings, interesting reads, community takeaways.'

const BlogLayout: LayoutComponent = ({ children, ...restProps }) => (
  <MainLayout {...restProps}>
    <SEO
      title="Blog"
      defaultMetaTitle
      description={description}
      keywords={keywords}
      pageInfo={restProps.pageContext.pageInfo}
    >
      <script async src="//embed.redditmedia.com/widgets/platform.js" />
    </SEO>
    {children}
  </MainLayout>
)

export default BlogLayout
