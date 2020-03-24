import React from 'react'
import { Helmet } from 'react-helmet'
import { LayoutComponent } from '../Layout'
import MainLayout from '../MainLayout'

const keywords =
  'git, data, version control, machine learning models management, datasets'
const description =
  'Data Version Control Blog. We write about machine learning workflow. From data versioning and processing to model productionization. We share our news, findings, interesting reads, community takeaways.'

const BlogLayout: LayoutComponent = ({ children, ...restProps }) => (
  <MainLayout {...restProps}>
    <Helmet
      meta={[
        {
          name: 'description',
          content: description
        },
        {
          name: 'keywords',
          content: keywords
        }
      ]}
    >
      <script async src="//embed.redditmedia.com/widgets/platform.js" />
    </Helmet>
    {children}
  </MainLayout>
)

export default BlogLayout
