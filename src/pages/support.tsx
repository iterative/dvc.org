import React from 'react'
import { PageProps } from 'gatsby'

import MainLayout from '../components/MainLayout'
import SEO from '@dvcorg/gatsby-theme-iterative/src/components/SEO'
import Support from '../components/Support'

const SupportPage = ({ location }: PageProps) => (
  <MainLayout location={location} className="mt-14">
    <SEO title="Support | Platinum Services For MLOps" />
    <Support />
  </MainLayout>
)

export default SupportPage
