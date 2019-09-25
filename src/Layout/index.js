import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withRouter } from 'next/router'
// components
import TopMenu from '../TopMenu'
import Footer from '../Footer'
import HamburgerMenu from '../HamburgerMenu'
// utils
import { initGA, logPageView } from '../utils/ga'

class Layout extends Component {
  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }
    logPageView()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { router } = nextProps
    this.isDocPage = router.pathname.split('/')[1] === 'doc'
  }

  render() {
    const { children, enableSmoothScroll } = this.props

    return (
      <Wrapper>
        <TopMenu isDocPage={this.isDocPage} />
        <HamburgerMenu />
        <Bodybag id="bodybag" enableSmoothScroll={enableSmoothScroll}>
          {children}
          <Footer isDocPage={this.isDocPage} />
        </Bodybag>
      </Wrapper>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  enableSmoothScroll: PropTypes.bool,
  router: PropTypes.object.isRequired
}

export default withRouter(Layout)

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
  transition: top 0.2s linear;
  -webkit-overflow-scrolling: touch;

  ${({ enableSmoothScroll }) =>
    enableSmoothScroll &&
    `
    scroll-behavior: smooth;
    will-change: scroll-position;
  `}
`
