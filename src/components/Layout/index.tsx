import React, { useEffect } from 'react'
import { useLocation } from '@reach/router'
import { GlobalStyle } from '../../styles'

import MainLayout from '../MainLayout'
import DocLayout from '../DocLayout'
import BlogLayout from '../BlogLayout'

import { allImagesLoadedInContainer } from '../../utils/images'

import './base.css'
import './fonts/fonts.css'

interface ILayoutProps {
  location: {
    pathname: string
  }
  pageContext: {
    is404: boolean
    isDocs: boolean
    isBlog: boolean
  }
}

export type LayoutComponent = React.SFC<ILayoutProps>

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

const Layout: LayoutComponent = props => {
  let LC: LayoutComponent = MainLayout as LayoutComponent // TODO: remove type cast

  useAnchorNavigation()

  if (!props.pageContext.is404) {
    if (props.pageContext.isDocs) {
      LC = DocLayout as LayoutComponent // TODO: remove type cast
    } else if (props.pageContext.isBlog) {
      LC = BlogLayout
    }
  }

  return (
    <>
      <GlobalStyle />
      <LC {...props} />
    </>
  )
}

export default Layout
