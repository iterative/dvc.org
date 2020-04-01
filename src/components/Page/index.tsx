import React from 'react'

import MainLayout, { LayoutComponent } from '../MainLayout'
import DefaultSEO from './DefaultSEO'
import DocumentationLayout from '../Documentation/Layout'
import Layout from '../Blog/Layout'

import { useRedirects, useAnchorNavigation, useSmoothScroll } from './utils'

import 'reset-css'
import './base.css'
import './fonts/fonts.css'
import styles from './styles.module.css'

export interface IPageProps {
  location: {
    pathname: string
  }
  pageContext: {
    is404: boolean
    isDocs: boolean
    isBlog: boolean
    pageInfo?: {
      currentPage: number
      nextPage?: string
    }
  }
  children: React.ReactNode
  enableSmoothScroll: boolean
}

const Page: React.SFC<IPageProps> = props => {
  let LayoutComponent = MainLayout

  useRedirects()
  useAnchorNavigation()
  useSmoothScroll(props.enableSmoothScroll)

  if (!props.pageContext.is404) {
    if (props.pageContext.isDocs) {
      LayoutComponent = DocumentationLayout as LayoutComponent
    } else if (props.pageContext.isBlog) {
      LayoutComponent = Layout
    }
  }

  return (
    <>
      <DefaultSEO />
      <LayoutComponent {...props} />
      <div id="modal-root" className={styles.modalRoot} />
    </>
  )
}

export default Page
