import React from 'react'
import PropTypes from 'prop-types'

import LocalLink from '../LocalLink'

import { logEvent } from '../../utils/ga'

import { GetStartedButton, Link, Links, Wrapper } from './styles'

export default function Nav({ mobile = false }) {
  return (
    <Wrapper mobile={mobile}>
      <Links>
        <LocalLink
          href="/features"
          as={Link}
          onClick={() => logEvent('menu', 'features')}
        >
          Features
        </LocalLink>
        <LocalLink
          href="/doc"
          as={Link}
          onClick={() => logEvent('menu', 'doc')}
        >
          Doc
        </LocalLink>
        <Link
          href="https://blog.dvc.org"
          onClick={() => logEvent('menu', 'blog')}
        >
          Blog
        </Link>
        <Link href="/chat" onClick={() => logEvent('menu', 'chat')}>
          Chat
        </Link>
        <Link
          href="https://github.com/iterative/dvc"
          onClick={() => logEvent('menu', 'github')}
        >
          GitHub
        </Link>
        <LocalLink
          href="/support"
          as={Link}
          onClick={() => logEvent('menu', 'support')}
        >
          Support
        </LocalLink>
      </Links>
      <LocalLink
        as={GetStartedButton}
        href="/doc/get-started"
        onClick={() => logEvent('menu', 'get-started')}
      >
        Get Started
      </LocalLink>
    </Wrapper>
  )
}

Nav.propTypes = {
  mobile: PropTypes.bool
}
