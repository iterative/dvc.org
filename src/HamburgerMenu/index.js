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
                  src="/static/img/logo_mobile.svg"
                  alt="dvc.org"
                  width={34}
                  height={34}
                />
              </Logo>
            </Top>

            <Columns>
              <Column>
                <Links>
                  <Link href="https://dvc.org" bold>
                    DVC.ORG
                  </Link>
                </Links>
              </Column>
              <Column>
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
          <DemoButton
            onClick={e => {
              e.preventDefault()
              showPopup()
            }}
          >
            Request a demo
          </DemoButton>
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
    display: block;
  `};

  ${props =>
    props.open &&
    `
    top: 0px;
    bottom: 0px;
    background: #fff;
    background-color: #a4c4c9;
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
    visibility:hidden;
  `};
`

const Section = styled.div``

const Top = styled.div`
  height: 40px;
  margin-bottom: 40.7px;
`

const Logo = styled.a`
  display: block;
  -webkit-transform-style: preserve-3d;
  transform: translate3d(0, 0, 0);
`

const Columns = styled.div`
  display: flex;
  flex-direction: column;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100px;
`

const Links = styled.div`
  margin-top: 26px;
  display: flex;
  flex-direction: column;
`

const Link = styled.a`
  line-height: 23px;
  font-size: 18px;
  margin-bottom: 17px;
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

const DemoButton = styled.button`
  width: 100%;
  height: 50px;
  margin-top: 8px;
  margin-left: 0px;
  font-size: 16px;
  border-radius: 4px;
  background-image: linear-gradient(to top, #26b077, #50eb5a);
  padding-left: 3px;
  border: none;
  color: #fff;
  cursor: pointer;
  font-weight: 500;
`
