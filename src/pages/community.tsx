import React from 'react'
import { PageProps } from 'gatsby'
import MainLayout from '../components/MainLayout'
import SEO from '@dvcorg/gatsby-theme-iterative/src/components/SEO'

import Community from '../components/Community'

const CommunityPage = ({ location }: PageProps) => (
  <MainLayout location={location} className="mt-14">
    <SEO title="Community" />
    <Community />
  </MainLayout>
)

export default CommunityPage
