import React, { Component } from 'react'
import styled from 'styled-components'
import { container, media } from '../styles'

import Nav from '../Nav'

const MIN_HEIGHT = 78

export default class TopMenu extends Component {
  state = {
    level: 0
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    this.handleScroll()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    let level = Math.min(window.scrollY, 25)

    this.setState({
      level
    })
  }

  render() {
    const { level } = this.state
    return (
      <Wrapper>
        <Container level={level}>
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
`

const Container = styled.section`
  ${container};
  width: auto;

  ${props => `
    height: ${MIN_HEIGHT + 20 - props.level}px;
  `}

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
    height: auto;
    min-height: ${MIN_HEIGHT}px;
  `};
  
  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    height: auto;
  }
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
