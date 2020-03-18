import React, { useEffect } from 'react'
import { useLocation } from '@reach/router'
import PropTypes from 'prop-types'
import { GlobalStyle } from '../../styles'

import MainLayout from '../MainLayout'
import DocLayout from '../DocLayout'

import './fonts/fonts.css'

const useAnchorNavigation = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const node = document.querySelector(location.hash)

      if (node) {
        node.scrollIntoView()
      }
    } else {
      document
        .getElementById('bodybag')
        .scrollTo({ top: 0, behavior: 'smooth' })
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
