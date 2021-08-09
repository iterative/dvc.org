import React from 'react'

import NotFound from '../components/NotFound'
import SEO from '../components/SEO'
// to be deleted, here to test caching!
// another comment to be deleted...
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
