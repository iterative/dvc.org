import React from 'react'
import PropTypes from 'prop-types'

import LocalLink from '../LocalLink'

import { logEvent } from '../../utils/ga'

import {
  Dropdown,
  DropdownInset,
  DropdownLink,
  DropdownWrapper,
  GetStartedButton,
  ImageLink,
  Image,
  Link,
  Links,
  Wrapper
} from './styles'

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
        <DropdownWrapper>
          <LocalLink
            href="/community"
            as={Link}
            onClick={() => logEvent('menu', 'community')}
          >
            Community
          </LocalLink>
          <Dropdown>
            <DropdownInset>
              <LocalLink
                href="/community#meet"
                as={DropdownLink}
                onClick={() => logEvent('menu', 'community')}
              >
                Meet the Community
              </LocalLink>
              <LocalLink
                href="/community#contribute"
                as={DropdownLink}
                onClick={() => logEvent('menu', 'community')}
              >
                Contribute
              </LocalLink>
              <LocalLink
                href="/community#learn"
                as={DropdownLink}
                onClick={() => logEvent('menu', 'community')}
              >
                Learn
              </LocalLink>
              <LocalLink
                href="/community#events"
                as={DropdownLink}
                onClick={() => logEvent('menu', 'community')}
              >
                Events
              </LocalLink>
            </DropdownInset>
          </Dropdown>
        </DropdownWrapper>
        <LocalLink
          href="/support"
          as={Link}
          onClick={() => logEvent('menu', 'support')}
        >
          Support
        </LocalLink>
        <ImageLink
          href="https://github.com/iterative/dvc"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Image src="/img/community/github.svg" />
        </ImageLink>
        <ImageLink href="/chat" target="_blank" rel="noreferrer noopener">
          <Image src="/img/community/discord.svg" />
        </ImageLink>
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
