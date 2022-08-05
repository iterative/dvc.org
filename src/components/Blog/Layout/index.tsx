import React from 'react'
import { Script } from 'gatsby'
import SEO from '@dvcorg/gatsby-theme-iterative/src/components/SEO'
import { LayoutComponent } from '@dvcorg/gatsby-theme-iterative/src/components/MainLayout'
import MainLayout from '../../../@dvcorg/gatsby-theme-iterative/components/MainLayout'

import * as styles from './styles.module.css'

const keywords =
  'git, data, version control, machine learning models management, datasets'
const description =
  'Data Version Control Blog. We write about machine learning workflow. ' +
  'From data versioning and processing to model productionization. We share ' +
  'our news, findings, interesting reads, community takeaways.'

const Layout: LayoutComponent = ({ children, ...restProps }) => (
  <MainLayout {...restProps} className={styles.layoutBlog}>
    <Script src="//embed.redditmedia.com/widgets/platform.js" />
    <SEO
      title="Blog"
      defaultMetaTitle
      description={description}
      keywords={keywords}
      pageInfo={restProps.pageContext.pageInfo}
    />
    {children}
  </MainLayout>
)

export default Layout
