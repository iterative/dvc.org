import React, { Component } from 'react'
import styled from 'styled-components'
// components
import TopMenu from '../TopMenu'
import Footer from '../Footer'
import HamburgerMenu from '../HamburgerMenu'
// utils
import { initGA, logPageView } from '../utils/ga'
import throttle from 'lodash.throttle'

function googleAnalytics() {
  if (!window.GA_INITIALIZED) {
    initGA()
    window.GA_INITIALIZED = true
  }
  logPageView()
}

export default class Layout extends Component {
  constructor() {
    super()
    this.state = {
      scrolled: false
    }
    this.handleScrollThrottled = throttle(this.handleScroll, 300)
  }

  componentDidMount() {
    googleAnalytics()
    this.bodybag = document.getElementById('bodybag');
    this.bodybag.addEventListener('scroll', this.handleScrollThrottled)
    this.handleScroll()
    this.isDocPage = window.location.pathname.split('/')[1] === 'doc'

  }

  componentWillUnmount() {
    this.bodybag.removeEventListener('scroll', this.handleScrollThrottled)
  }

  handleScroll = (e) => {
    const scrollTop = e ? e.target.scrollTop : 0;
    this.setState({
      scrolled: scrollTop > 25
    })
  }

  render() {
    const { children } = this.props
    const { scrolled } = this.state

    return (
      <Wrapper>
        <TopMenu scrolled={this.isDocPage || scrolled} />
        <HamburgerMenu />
        <Bodybag id="bodybag" ref={ref => this.bodybag = ref}>
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
  scroll-behavior: smooth;
`
