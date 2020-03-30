import React from 'react'
import { GlobalStyle } from '../../styles'

import MainLayout, { LayoutComponent } from '../MainLayout'
import DefaultSEO from './DefaultSEO'
import DocLayout from '../DocLayout'
import BlogLayout from '../BlogLayout'

import { useRedirects, useAnchorNavigation, useSmoothScroll } from './utils'

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
  let LayoutComponent = MainLayout as LayoutComponent // TODO: remove type cast

  useRedirects()
  useAnchorNavigation()
  useSmoothScroll(props.enableSmoothScroll)

  if (!props.pageContext.is404) {
    if (props.pageContext.isDocs) {
      LayoutComponent = DocLayout as LayoutComponent // TODO: remove type cast
    } else if (props.pageContext.isBlog) {
      LayoutComponent = BlogLayout
    }
  }

  return (
    <>
      <GlobalStyle />
      <DefaultSEO />
      <LayoutComponent {...props} />
      <div id="modal-root" className={styles.modalRoot} />
    </>
  )
}

export default Page
