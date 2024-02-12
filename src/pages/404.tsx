import React from 'react'
import { PageProps } from 'gatsby'
import SEO from '@dvcorg/gatsby-theme-iterative/src/components/SEO'
import MainLayout from '../components/MainLayout'

import NotFound from '../components/NotFound'

const NotFoundPage = ({ location }: PageProps) => (
  <MainLayout location={location} className="mt-14">
    <SEO
      title="404 | This page could not be found"
      description="404 | This page could not be found"
    />
    <NotFound />
  </MainLayout>
)

export default NotFoundPage
