import React from 'react'

import NotFound from '../components/NotFound'
import SEO from '@dvcorg/gatsby-theme-iterative/src/components/SEO'

const NotFoundPage: React.FC = () => (
  <>
    <SEO
      title="404 | This page could not be found"
      description="404 | This page could not be found"
    />
    <NotFound />
  </>
)

export default NotFoundPage
