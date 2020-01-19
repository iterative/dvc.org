import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

import { global } from '../styles'
import Layout from '../Layout'

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
