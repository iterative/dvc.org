import { PageProps } from 'gatsby'

import MainLayout from '@dvcorg/gatsby-theme/src/components/MainLayout'
import SEO from '@dvcorg/gatsby-theme/src/components/SEO'

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
