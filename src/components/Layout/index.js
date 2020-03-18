import React, { useEffect } from 'react'
import { useLocation } from '@reach/router'
import PropTypes from 'prop-types'
import { GlobalStyle } from '../../styles'

import MainLayout from '../MainLayout'
import DocLayout from '../DocLayout'

import { allImagesLoadedInContainer } from '../../utils/images'

import './fonts/fonts.css'

const useAnchorNavigation = () => {
  const location = useLocation()

  useEffect(() => {
    const bodybag = document.getElementById('bodybag')

    if (location.hash) {
      const node = document.querySelector(location.hash)

      if (node) {
        allImagesLoadedInContainer(bodybag).then(() => node.scrollIntoView())
      }
    } else {
      bodybag.scrollTo({ top: 0 })
    }
  }, [location.href])
}

export default function Layout(props) {
  let LayoutComponent = MainLayout

  useAnchorNavigation()

  if (!props.pageContext.is404 && /^\/doc/.test(props.location.pathname)) {
    LayoutComponent = DocLayout
  }

  return (
    <>
      <GlobalStyle />
      <LayoutComponent {...props} />
    </>
  )
}

Layout.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }),
  pageContext: PropTypes.shape({
    is404: PropTypes.bool
  })
}
