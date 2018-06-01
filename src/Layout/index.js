import React, { Component } from 'react'
import styled from 'styled-components'

import { initGA, logPageView } from '../utils/ga'

import TopMenu from '../TopMenu'
import Footer from '../Footer'
import HamburgerMenu from '../HamburgerMenu'

export default class Layout extends Component {
  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }
    logPageView()
  }

  render() {
    const { children, stickHeader = false } = this.props

    return (
      <Wrapper>
        <TopMenu stickHeader={stickHeader} />
        <HamburgerMenu />
        {children}
        <Footer />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div``
