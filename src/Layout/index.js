import React, { Component } from 'react'
import styled from 'styled-components'
// components
import TopMenu from '../TopMenu'
import Footer from '../Footer'
import HamburgerMenu from '../HamburgerMenu'
// utils
import { initGA, logPageView } from '../utils/ga'

function googleAnalytics() {
  if (!window.GA_INITIALIZED) {
    initGA()
    window.GA_INITIALIZED = true
  }
  logPageView()
}

export default class Layout extends Component {

  componentDidMount() {
    googleAnalytics()
  }

  render() {
    const { children } = this.props

    return (
      <Wrapper>
        <TopMenu />
        <HamburgerMenu />
        <Bodybag id="bodybag">
          {children}
          <Footer />
        </Bodybag>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  overflow: hidden;
`

const Bodybag = styled.div`
  position: fixed;
  top: 80px;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  transition: top .2s linear;
  -webkit-overflow-scrolling: touch;
`
