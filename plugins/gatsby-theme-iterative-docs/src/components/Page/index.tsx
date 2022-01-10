import React from 'react'

import DefaultSEO from './DefaultSEO'
import DocumentationLayout from 'gatsby-theme-iterative-docs/src/components/Documentation/Layout'

import { useRedirects, useAnchorNavigation, useSmoothScroll } from './utils'

import 'reset-css'
import './base.css'
import './fonts/fonts.css'

export interface IPageProps {
  location: {
    pathname: string
  }
  pageContext: {
    is404: boolean
    isDocs: boolean
    isBlog: boolean
    isAlertLanding: boolean
    pageInfo?: {
      currentPage: number
      nextPage?: string
    }
  }
  children: React.ReactNode
  enableSmoothScroll: boolean
}

const Page: React.FC<IPageProps> = props => {
  useRedirects()
  useAnchorNavigation()
  useSmoothScroll(props.enableSmoothScroll)

  return (
    <>
      <DefaultSEO pathname={props.location.pathname} />
      <DocumentationLayout {...props} />
    </>
  )
}

export default Page
