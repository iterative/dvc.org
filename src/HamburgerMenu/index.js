import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import NextLink from 'next/link'
import { media } from '../styles'

import Hamburger from '../Hamburger'
import { logEvent } from '../utils/ga'

const SocialLink = ({ src, href, click, children }) => (
  <Link src={src} href={href} onClick={click}>
    {children}
  </Link>
)

SocialLink.propTypes = {
  src: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

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

  itemClick = item => () => {
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
                <NextLink href="/" passHref>
                  <Logo>
                    <img
                      src="/img/logo_white.png"
                      alt="dvc.org"
                      width={34}
                    />
                  </Logo>
                </NextLink>
              </Top>

              <Columns>
                <Column>
                  <Heading>Product</Heading>
                  <Links>
                    <NextLink href="/" passHref>
                      <Link onClick={this.scrollToTop}>Overview</Link>
                    </NextLink>
                    <NextLink href="/features" passHref>
                      <Link onClick={this.itemClick('features')}>Features</Link>
                    </NextLink>
                  </Links>
                </Column>
                <Column>
                  <Heading>Help</Heading>
                  <Links>
                    <NextLink href="/support" passHref>
                      <Link onClick={this.itemClick('support')}>Support</Link>
                    </NextLink>
                    <NextLink href="/doc/get-started" passHref>
                      <Link onClick={this.itemClick('get-started')}>
                        Get started
                      </Link>
                    </NextLink>
                    <SocialLink
                      src="/img/chat.png"
                      href="/chat"
                      click={this.itemClick('chat')}
                    >
                      Chat
                    </SocialLink>
                    <NextLink href="/doc" passHref>
                      <Link onClick={this.itemClick('doc')}>Documentation</Link>
                    </NextLink>
                  </Links>
                </Column>
                <Column>
                  <Heading>Company</Heading>
                  <Links>
                    <Link
                      href="https://blog.dvc.org/"
                      onClick={this.itemClick('blog')}
                    >
                      Blog
                    </Link>
                    <SocialLink
                      src="/img/iterative.png"
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
                      src="/img/twitter.png"
                      href="https://twitter.com/DVCorg "
                      click={this.itemClick('twitter')}
                    >
                      Twitter
                    </SocialLink>
                    <SocialLink
                      src="/img/github.png"
                      href="https://github.com/iterative/dvc"
                      click={this.itemClick('github')}
                    >
                      GitHub
                    </SocialLink>
                    <SocialLink
                      src="/img/discord.png"
                      href="/chat"
                      click={this.itemClick('chat')}
                    >
                      Discord
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
  transition: transform 0.4s ease;
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
  transform-style: preserve-3d;
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
