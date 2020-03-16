import React from 'react'

import Page404 from '../components/404'
import SEO from '../components/SEO'

function NotFoundPage() {
  return (
    <>
      <SEO
        title="404 | This page could not be found"
        description="404 | This page could not be found"
      />
      <Page404 />
    </>
  )
}

export default NotFoundPage
