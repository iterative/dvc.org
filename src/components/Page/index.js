import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Layout from '../Layout'

import { GlobalStyle } from '../../styles'

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
