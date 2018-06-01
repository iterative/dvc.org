import React, { Component } from 'react'
import styled from 'styled-components'
import { container, media } from '../styles'

import Nav from '../Nav'

const MIN_HEIGHT = 88
const STICKY_FROM = 25 / 2

export default class TopMenu extends Component {
  state = {
    sticky: false,
    level: 0
  }

  componentDidMount() {
    return;
    window.addEventListener('scroll', this.handleScroll)
    this.handleScroll()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    const top = window.scrollY
    const heroHeight = document.getElementById('hero').clientHeight

    const nextSticky = top >= STICKY_FROM
    let level = top / heroHeight
    if (level >= 1) level = 1

    this.setState({
      level
    })

    if (nextSticky !== this.state.sticky) {
      this.setState({
        sticky: nextSticky
      })
    }
  }

  render() {
    const { sticky, level } = this.state
    return (
      <Wrapper sticky={sticky} level={level} fullySticky={level === 1}>
        <Container>
          <Logo href="/">
            <img src="/static/img/logo.svg" alt="dvc.org" />
          </Logo>
          <Nav mobile={false} />
        </Container>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  position: fixed;
  z-index: 10;
  top: 0px;
  left: 0px;
  right: 0px;

  min-height: ${MIN_HEIGHT}px;

  ${props =>
    props.sticky &&
    `
    transform: translateZ(0);
    min-height: 85px;
    background-color: rgba(23, 48, 66, ${props.level});
  `};

  ${props =>
    props.fullySticky &&
    `
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.18;
        z-index: 0;
        background-image: url('/static/img/hero-bg.png');
      }
    `};
`

const Container = styled.section`
  ${container};
  width: auto;

  z-index: 3;
  position: relative;

  color: #ffffff;
  display: flex;
  justify-content: space-between;

  ${media.phablet`
     flex-direction: column;
  `};
`

const Logo = styled.a`
  margin-top: 25px;
  display: block;
`
