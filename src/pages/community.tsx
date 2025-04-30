import SEO from '@dvcorg/gatsby-theme-iterative/src/components/SEO'
import { PageProps } from 'gatsby'

import Community from '../components/Community'
import MainLayout from '../components/MainLayout'

const CommunityPage = ({ location }: PageProps) => (
  <MainLayout location={location} className="mt-14">
    <SEO title="Community" />
    <Community />
  </MainLayout>
)

export default CommunityPage
