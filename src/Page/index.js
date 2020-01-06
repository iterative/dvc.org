import React, { Component } from 'react'

import Layout from '../Layout'
import PropTypes from 'prop-types'
import { createGlobalStyle } from 'styled-components'
import { global } from '../styles'
import reset from 'styled-reset'

const GlobalStyle = createGlobalStyle`
  ${reset}
  ${global}
`

export default class Page extends Component {
  render() {
    const { children, ...rest } = this.props

    return (
      <>
        <GlobalStyle />
        <Layout {...rest}>{children}</Layout>
      </>
    )
  }
}

Page.propTypes = {
  children: PropTypes.node.isRequired
}
