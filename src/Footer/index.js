import React from 'react'

import styled from 'styled-components'
import { columns, container, media } from '../styles'

const SocialLink = ({ src, href, children }) => (
  <Link src={src} href={href}>
    {children}
  </Link>
)

export default () => (
  <Footer>
    <Container>
      <Top>
        <Logo href="/">
          <img
            src="/static/img/logo_white.png"
            alt="DVC.org"
            width={36}
            height={23}
          />
        </Logo>
      </Top>
      <Columns>
        <Column>
          <Heading>Product</Heading>
          <Links>
            <Link href="/?">Overview</Link>
            <Link href="/features">Features</Link>
          </Links>
        </Column>
        <Column>
          <Heading>Help</Heading>
          <Links>
            <Link href="https://blog.dataversioncontrol.com/data-version-control-tutorial-9146715eda46">
              Get started
            </Link>
            <Link href="/documentation">Documentation</Link>
          </Links>
        </Column>
        <Column>
          <Heading>Company</Heading>
          <Links>
            <Link href="https://iterative.ai/">Iterative.ai</Link>
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
              href="https://github.com/iterative/dvc"
            >
              Github
            </SocialLink>
          </Links>
        </Column>
      </Columns>
      <Address>450 Townsend St. Suite 100, San Francisco, CA 94107</Address>
      <Copyright>
        © 2018 <small>Iterative, Inc</small>
      </Copyright>
    </Container>
  </Footer>
)

const Footer = styled.section`
  min-height: 300px;
  background-color: #40364d;
  color: #fff;

  ${media.phablet`
    min-height: auto;
  `};
`

const Container = styled.div`
  ${container};
  padding-top: 64px;
  padding-bottom: 44px;
  
  ${media.phablet`
    padding-top: 31px !important;
    padding-bottom: 31px !important;
  `};
`

const Top = styled.div`
  height: 40px;
  margin-bottom: 40.7px;
`

const Logo = styled.a``

const Columns = styled.div`
  ${columns};

  ${media.phablet`
      justify-content: space-between;
  `};
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 150px;
  margin-right: 66px;

  ${media.phablet`
    margin-right: 0px;
  `};
`

const Heading = styled.h2`
  opacity: 0.61;
  color: #ffffff;
  font-size: 20px;
  font-weight: 100;
`

const Links = styled.div`
  margin-top: 29px;
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

const SocialIcon = styled.img`
  width: 26px;
  height: 26px;
  margin-right: 14px;
`

const Address = styled.div`
  padding-bottom: 18px;
  padding-top: 36px;
`

const Copyright = styled.div`
  padding-bottom: 18px;
  padding-top: 18px;
  font-size: 14px;

  small {
  }
`
