import React from 'react'
import PropTypes from 'prop-types'

import NextLink from 'next/link'
import Router from 'next/router'

import { logEvent } from '../../utils/ga'

import { GetStartedButton, Link, Links, Wrapper } from './styles'

const getStarted = () => {
  logEvent('menu', 'get-started')

  Router.push('/doc/get-started')
}

export default function Nav({ mobile = false }) {
  return (
    <Wrapper mobile={mobile}>
      <Links>
        <NextLink href="/features" passHref>
          <Link
            onClick={() => {
              logEvent('menu', 'features')
            }}
          >
            Features
          </Link>
        </NextLink>
        <NextLink href="/doc" passHref>
          <Link
            onClick={() => {
              logEvent('menu', 'doc')
            }}
          >
            Doc
          </Link>
        </NextLink>
        <Link
          href="https://blog.dvc.org"
          onClick={() => {
            logEvent('menu', 'blog')
          }}
        >
          Blog
        </Link>
        <Link
          href="/chat"
          onClick={() => {
            logEvent('menu', 'chat')
          }}
        >
          Chat
        </Link>
        <Link
          href="https://github.com/iterative/dvc"
          onClick={() => {
            logEvent('menu', 'github')
          }}
        >
          GitHub
        </Link>
        <NextLink href="/support" passHref>
          <Link
            onClick={() => {
              logEvent('menu', 'support')
            }}
          >
            Support
          </Link>
        </NextLink>
      </Links>
      <GetStartedButton onClick={getStarted}>Get Started</GetStartedButton>
    </Wrapper>
  )
}

Nav.propTypes = {
  mobile: PropTypes.bool
}
