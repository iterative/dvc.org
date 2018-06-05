import React, { Component } from 'react'
import styled from 'styled-components'
import { container, media } from '../styles'

import Nav from '../Nav'

const MIN_HEIGHT = 78
const STICKY_FROM = 25 / 2

export default class TopMenu extends Component {
  state = {
    sticky: false,
    level: 0
  }

  componentDidMount() {
    return
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

const Wrapper = styled.div`
  position: fixed;
  z-index: 10;
  top: 0px;
  left: 0px;
  right: 0px;

  background-color: #ffffff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);

  ${props =>
    props.sticky &&
    `
    transform: translateZ(0);
    min-height: 78px;
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
  min-height: ${MIN_HEIGHT + 20}px;

  z-index: 3;
  position: relative;

  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${media.phablet`
    flex-direction: column;
    justify-content: center;
    align-items: start;
    min-height: ${MIN_HEIGHT}px;
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
