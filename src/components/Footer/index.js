import React from 'react'
import PropTypes from 'prop-types'

import LocalLink from '../LocalLink'

import { getFirstPage } from '../../utils/sidebar'

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

const docsPage = getFirstPage()

const SocialLink = ({ src, href, children }) => (
  <Link src={src} href={href} target="_blank" rel="noreferrer noopener">
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
          <LocalLink href="/" as={Logo}>
            <img
              src="/img/logo_white.png"
              alt="site logo"
              width={36}
              height={23}
            />
          </LocalLink>
        </Top>
        <Columns>
          <Column>
            <Heading>Product</Heading>
            <Links>
              <LocalLink href="/" as={Link}>
                Overview
              </LocalLink>
              <LocalLink href="/features" as={Link}>
                Features
              </LocalLink>
            </Links>
          </Column>
          <Column>
            <Heading>Help</Heading>
            <Links>
              <LocalLink href="/support" as={Link}>
                Support
              </LocalLink>
              <LocalLink href="/doc/tutorials/get-started" as={Link}>
                Get started
              </LocalLink>
              <LocalLink href="/community" as={Link}>
                Community
              </LocalLink>
              <LocalLink href={docsPage} as={Link}>
                Documentation
              </LocalLink>
            </Links>
          </Column>
          <Column>
            <Heading>Company</Heading>
            <Links>
              <Link href="https://blog.dvc.org/">Blog</Link>
              <SocialLink src="/img/iterative.png" href="https://iterative.ai/">
                Iterative.ai
              </SocialLink>
              <Link href="/doc/user-guide/privacy">Privacy Policy</Link>
            </Links>
          </Column>
          <Column>
            <Heading>Social</Heading>
            <Links>
              <SocialLink
                src="/img/twitter.png"
                href="https://twitter.com/DVCorg"
              >
                Twitter
              </SocialLink>
              <SocialLink
                src="/img/github.png"
                href="https://github.com/iterative/dvc"
              >
                GitHub
              </SocialLink>
              <SocialLink src="/img/discord.png" href="/chat">
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
