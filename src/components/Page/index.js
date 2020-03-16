import React, { useEffect } from 'react'
import { useLocation } from '@reach/router'
import PropTypes from 'prop-types'

import Layout from '../Layout'

import { GlobalStyle } from '../../styles'

const useAnchorNavigation = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const node = document.querySelector(location.hash)

      if (node) {
        node.scrollIntoView()
      }
    }
  }, [location.href])
}

const Page = ({ children, ...rest }) => {
  useAnchorNavigation()

  return (
    <>
      <GlobalStyle />
      <Layout {...rest}>{children}</Layout>
    </>
  )
}

Page.propTypes = {
  children: PropTypes.node.isRequired
}

export default Page
