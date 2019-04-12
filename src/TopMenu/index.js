import React, { Component } from 'react'
// components
import Nav from '../Nav'
// utils
import throttle from 'lodash.throttle'
// styles
import styled from 'styled-components'
import { media } from '../styles'

const MIN_HEIGHT = 78

class TopMenu extends Component {
  constructor() {
    super()
    this.state = {
      scrolled: false
    }
    this.handleScrollThrottled = throttle(this.handleScroll, 300)
  }

  componentDidMount() {
    this.bodybag = document.getElementById('bodybag')
    this.isPhablet = window.innerWidth <= 572

    if (!this.isPhablet) {
      this.bodybag.addEventListener('scroll', this.handleScrollThrottled)
      this.handleScroll()
    }
  }

  componentWillUnmount() {
    if (!this.isPhablet) {
      this.bodybag.removeEventListener('scroll', this.handleScrollThrottled)
    }
  }

  handleScroll = e => {
    if (this.props.isDocPage) return
    const scrollTop = e ? e.target.scrollTop : 0
    this.setState({
      scrolled: scrollTop > 25
    })
  }

  render() {
    const { isDocPage } = this.props
    const { scrolled } = this.state

    return (
      <Wrapper>
        <Container scrolled={isDocPage || scrolled} wide={isDocPage}>
          <Logo href="/">
            <img
              src="/static/img/logo.png"
              alt="dvc.org"
              width={36}
              height={23}
            />
          </Logo>
          <Nav mobile={false} />
        </Container>
      </Wrapper>
    )
  }
}

export default TopMenu

const Wrapper = styled.div`
  position: fixed;
  z-index: 10;
  top: 0px;
  left: 0px;
  right: 0px;

  background-color: #ffffff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);
  overflow-y: scroll;

  &::-webkit-scrollbar {
    visibility: hidden;
  }
`

const Container = styled.section`
  margin: 0 auto;
  padding: 0px 15px;
  max-width: ${props => (props.wide ? '1200px' : '1005px')};
  min-height: ${MIN_HEIGHT}px;
  width: auto;

  ${props => `
    height: ${MIN_HEIGHT + (props.scrolled ? 0 : 20)}px;
  `};

  z-index: 3;
  position: relative;
  color: #ffffff;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  transition: height 0.2s linear;
  will-change: height;

  ${media.phablet`
    flex-direction: column;
    justify-content: center;
    align-items: start;
    height: auto;
  `};
`

const Logo = styled.a`
  display: block;
  padding-top: 10px;
  z-index: 999;

  ${media.phablet`
    padding-top: 10px;
    padding-bottom: 0px;
  `};
`
