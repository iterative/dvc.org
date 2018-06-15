import React, { Component } from 'react'
import styled from 'styled-components'
import { media } from '../styles'

import Hamburger from '../Hamburger'

const SocialLink = ({ src, href, children }) => (
  <Link src={src} href={href}>
    {children}
  </Link>
)

export default class HamburgerMenu extends Component {
  state = {
    menu: false
  }

  toggleMobileMenu = () =>
    this.setState(prevState => ({
      menu: !prevState.menu
    }))

  close = () =>
    this.setState({
      menu: false
    })

  itemClick = () => {
    this.close()
    window.scrollTo(0, 0)
  }

  render() {
    const { menu } = this.state

    return (
      <Wrapper open={menu}>
        <Button onClick={this.toggleMobileMenu}>
          <Hamburger open={menu} />
        </Button>

        <Menu visible={menu}>
          <Section>
            <Top>
              <Logo href="/">
                <img
                  src="/static/img/logo_white.png"
                  alt="dvc.org"
                  width={34}
                />
              </Logo>
            </Top>

            <Columns>
              <Column>
                <Heading>Product</Heading>
                <Links>
                  <Link href="/#" onClick={this.itemClick}>
                    Overview
                  </Link>
                  <Link href="/features" onClick={this.itemClick}>
                    Features
                  </Link>
                </Links>
              </Column>
              <Column>
                <Heading>Help</Heading>
                <Links>
                  <Link
                    href="https://blog.dataversioncontrol.com/data-version-control-tutorial-9146715eda46"
                    onClick={this.itemClick}
                  >
                    Get started
                  </Link>
                  <Link href="/documentation" onClick={this.itemClick}>
                    Documentation
                  </Link>
                  <Link href="/documentation" onClick={this.itemClick}>
                    Discuss
                  </Link>
                </Links>
              </Column>
              <Column>
                <Heading>Company</Heading>
                <Links>
                  <Link href="https://blog.dataversioncontrol.com/">Blog</Link>
                  <SocialLink
                    src="/static/img/iterative.png"
                    href="https://iterative.ai/"
                  >
                    Iterative.ai
                  </SocialLink>
                </Links>
              </Column>
              <Column>
                <Heading>Social</Heading>
                <Links>
                  <SocialLink
                    src="/static/img/twitter.png"
                    href="https://twitter.com/Iterativeai "
                  >
                    Twitter
                  </SocialLink>
                  <SocialLink
                    src="/static/img/github.png"
                    href="https://github.com/iterative"
                  >
                    Github
                  </SocialLink>
                </Links>
              </Column>
            </Columns>
          </Section>
        </Menu>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  padding: 25px 31px 20px 31px;
  display: none;
  position: fixed;
  z-index: 10;
  transform: translate3d(0, 0, 0);
  left: 0px;
  right: 0px;
  -webkit-transform-style: preserve-3d;

  > * {
    transform: translateZ(0);
  }

  ${media.phablet`
    top: 0px;
    display: block;
  `};

  ${props =>
    props.open &&
    `
    top: 0px;
    bottom: 0px;
    
    background-color: #40364d;
    color: #fff;
  `};
`

const Button = styled.button`
  position: absolute;
  z-index: 999;

  right: 15px;
  top: 25px;

  width: 46px;
  height: 36px;

  border: none;
  background: transparent;
`

const Menu = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;

  ${props =>
    !props.visible &&
    `
    z-index: -99999;
    display: none;
  `};
`

const Section = styled.div``

const Top = styled.div`
  height: 40px;
  margin-bottom: 40.7px;
`

const Logo = styled.a`
  margin-top: 5px;
  display: block;
  -webkit-transform-style: preserve-3d;
  transform: translate3d(0, 0, 0);
`

const Columns = styled.div`
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  flex-basis: 50%;
`

const Links = styled.div`
  display: flex;
  flex-direction: column;
`

const Heading = styled.h2`
  opacity: 0.61;
  color: #fff;
  font-size: 20px;
  font-weight: 100;
`

const Link = styled.a`
  font-size: 18px;
  padding: 8px 0px;
  display: flex;
  color: #fff;
  text-decoration: none;

  &:hover {
    color: #fff;
  }

  ${props =>
    props.src &&
    `
    &::before {
      margin-right: 14px;
      width: 26px;
      height: 26px;
      content: '';
      background-image: url(${props.src});
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
    }
  `};
`
