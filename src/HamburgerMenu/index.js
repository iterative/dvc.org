import React, { Component } from 'react'
import styled from 'styled-components'
import { media } from '../styles'

import Hamburger from '../Hamburger'
import { logEvent } from "../utils/ga";

const SocialLink = ({ src, href, click, children }) => (
  <Link src={src} href={href} onClick={click}>
    {children}
  </Link>
)

export default class HamburgerMenu extends Component {
  state = {
    menu: false,
    clicked: false
  }

  toggleMobileMenu = () => {
    if (!this.state.clicked) {
      logEvent('hamburger', 'open')
    }
    this.setState(prevState => ({
      menu: !prevState.menu,
      clicked: false
    }))
  }

  close = () =>
    this.setState({
      menu: false
    })

  itemClick = (item) => () => {
    this.close()
    logEvent('hamburger', item)
  }

  scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  render() {
    const { menu } = this.state

    return (
      <div>          
        <Button onClick={this.toggleMobileMenu}>
          <Hamburger open={menu} />
        </Button>
        
        <Wrapper open={menu}>
          <Menu>
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
                    <Link href="/#" onClick={this.scrollToTop}>
                      Overview
                    </Link>
                    <Link href="/features" onClick={this.itemClick('features')}>
                      Features
                    </Link>
                  </Links>
                </Column>
                <Column>
                  <Heading>Help</Heading>
                  <Links>
                    <Link
                      href="/doc/get-started"
                      onClick={this.itemClick('get-started')}
                    >
                      Get started
                    </Link>
                    <Link
                      href="https://blog.dataversioncontrol.com/data-version-control-tutorial-9146715eda46"
                      onClick={this.itemClick('tutorial')}
                    >
                      Tutorial
                    </Link>
                    <Link href="/doc" onClick={this.itemClick('documentation')}>
                      Documentation
                    </Link>
                    <Link href="https://discuss.dvc.org" onClick={this.itemClick('discuss')}>
                      Discuss
                    </Link>
                  </Links>
                </Column>
                <Column>
                  <Heading>Company</Heading>
                  <Links>
                    <Link href="https://blog.dataversioncontrol.com/" onClick={this.itemClick('blog')}>Blog</Link>
                    <SocialLink
                      src="/static/img/iterative.png"
                      href="https://iterative.ai/"
                      click={this.itemClick('iterative')}
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
                      click={this.itemClick('twitter')}
                    >
                      Twitter
                    </SocialLink>
                    <SocialLink
                      src="/static/img/github.png"
                      href="https://github.com/iterative"
                      click={this.itemClick('github')}
                    >
                      Github
                    </SocialLink>
                  </Links>
                </Column>
              </Columns>
            </Section>
          </Menu>
        </Wrapper>
      </div>
      
    )
  }
}

const Wrapper = styled.div`
  padding: 25px 31px 20px 31px;
  display: none;
  position: fixed;
  z-index: 10;
  transform: translateX(100%);
  transition: transform .4s ease;
  will-change: transform;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  background-color: #40364d;
  color: #fff;

  ${media.phablet`
    display: block;
  `};

  ${props =>
    props.open &&
    `
    transform: translateX(0);
  `};
`

const Button = styled.button`
  position: fixed;
  display: none;
  z-index: 999;

  right: 15px;
  top: 25px;

  width: 46px;
  height: 36px;

  border: none;
  background: transparent;

  ${media.phablet`
    display: block;
  `};
`

const Menu = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
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
