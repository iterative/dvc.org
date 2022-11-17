import React from 'react'
import { PageProps } from 'gatsby'
import MainLayout from '@dvcorg/gatsby-theme-iterative/src/components/MainLayout'
import SEO from '@dvcorg/gatsby-theme-iterative/src/components/SEO'

import Community from '../components/Community'

const CommunityPage = ({ location }: PageProps) => (
  <MainLayout location={location}>
    <SEO title="Community" />
    <Community />
  </MainLayout>
)

export default CommunityPage
