import React from 'react'
import { PageProps } from 'gatsby'
import MainLayout from '@dvcorg/gatsby-theme-iterative/src/components/MainLayout'

import Home from '../components/Home'

const HomePage = ({ location }: PageProps) => (
  <MainLayout location={location} className="mt-14">
    <Home />
  </MainLayout>
)

export default HomePage
