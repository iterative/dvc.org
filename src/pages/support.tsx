import { PageProps } from 'gatsby'

import SEO from '@dvcorg/gatsby-theme/src/components/SEO'

import MainLayout from '../components/MainLayout'
import Support from '../components/Support'

const SupportPage = ({ location }: PageProps) => (
  <MainLayout location={location} className="mt-14">
    <SEO title="Support" />
    <Support />
  </MainLayout>
)

export default SupportPage
