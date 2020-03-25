import React, { useEffect } from 'react'
import { useLocation } from '@reach/router'
import { GlobalStyle } from '../../styles'

import MainLayout, { LayoutComponent } from '../MainLayout'
import DocLayout from '../DocLayout'
import BlogLayout from '../BlogLayout'

import { allImagesLoadedInContainer } from '../../utils/images'

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
  }
  children: React.ReactNode
  enableSmoothScroll: boolean
}

const useAnchorNavigation = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const node = document.querySelector(location.hash)

      if (node) {
        allImagesLoadedInContainer(document.body).then(() =>
          node.scrollIntoView()
        )
      }
    } else {
      document.body.scrollTop = 0
    }
  }, [location.href])
}

const enableSmoothScroll = (enable: boolean) => {
  useEffect(() => {
    document.body.classList.toggle('bodySmoothScrolling', enable)
  }, [enable])
}

const Page: React.SFC<IPageProps> = props => {
  let LayoutComponent = MainLayout as LayoutComponent // TODO: remove type cast

  useAnchorNavigation()
  enableSmoothScroll(props.enableSmoothScroll)

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
      <LayoutComponent {...props} />
      <div id="modal-root" className={styles.modalRoot} />
    </>
  )
}

export default Page
