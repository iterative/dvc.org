import React from 'react'
import { PageProps } from 'gatsby'
import MainLayout from '@dvcorg/gatsby-theme-iterative/src/components/MainLayout'
import ThankYou from '../components/ThankYou'

const ThankYouPage = ({ location }: PageProps) => (
  <MainLayout location={location}>
    <ThankYou />
  </MainLayout>
)
export default ThankYouPage
