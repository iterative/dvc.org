import React from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'

import {
  Column,
  Columns,
  Copyright,
  Container,
  Heading,
  Link,
  Links,
  Logo,
  Top,
  Wrapper
} from './styles'

const SocialLink = ({ src, href, children }) => (
  <Link src={src} href={href}>
    {children}
  </Link>
)

SocialLink.propTypes = {
  src: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default function Footer(props) {
  return (
    <Wrapper>
      <Container wide={props.isDocPage}>
        <Top>
          <NextLink href="/">
            <Logo>
              <img
                src="/static/img/logo_white.png"
                alt="site logo"
                width={36}
                height={23}
              />
            </Logo>
          </NextLink>
        </Top>
        <Columns>
          <Column>
            <Heading>Product</Heading>
            <Links>
              <NextLink href="/" passHref>
                <Link>Overview</Link>
              </NextLink>
              <NextLink href="/features" passHref>
                <Link>Features</Link>
              </NextLink>
            </Links>
          </Column>
          <Column>
            <Heading>Help</Heading>
            <Links>
              <NextLink href="/support" passHref>
                <Link>Support</Link>
              </NextLink>
              <NextLink href="/doc" as="/doc/get-started" passHref>
                <Link>Get started</Link>
              </NextLink>
              <SocialLink src="/static/img/chat.png" href="/chat">
                Chat
              </SocialLink>
              <NextLink href="/doc" passHref>
                <Link>Documentation</Link>
              </NextLink>
            </Links>
          </Column>
          <Column>
            <Heading>Company</Heading>
            <Links>
              <Link href="https://blog.dvc.org/">Blog</Link>
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
                href="https://twitter.com/DVCorg"
              >
                Twitter
              </SocialLink>
              <SocialLink
                src="/static/img/github.png"
                href="https://github.com/iterative/dvc"
              >
                GitHub
              </SocialLink>
              <SocialLink src="/static/img/discord.png" href="/chat">
                Discord
              </SocialLink>
            </Links>
          </Column>
        </Columns>
        <Copyright />
      </Container>
    </Wrapper>
  )
}

Footer.propTypes = {
  isDocPage: PropTypes.bool
}
