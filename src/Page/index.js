import React, { Component } from 'react'
import styled from 'styled-components'
import Layout from '../Layout'

export default class Page extends Component {
  render() {
    const { children, ...rest } = this.props

    return <Layout {...rest}>{children}</Layout>
  }
}
