import React, { useCallback, useState } from 'react'

import Hamburger from '../Hamburger'
import LocalLink from '../LocalLink'

import { logEvent } from '../../utils/ga'

import {
  Button,
  Image,
  ImageComment,
  ImageLink,
  Link,
  LinkButton,
  Logo,
  Menu,
  Section,
  Subsection,
  Top,
  Wrapper
} from './styles'

export default function HamburgerMenu() {
  const [menu, setMenu] = useState(false)
  const [clicked, setClicked] = useState(false)

  const toggleMobileMenu = useCallback(() => {
    if (clicked) {
      logEvent('hamburger', 'open')
    }

    setMenu(!menu)
    setClicked(false)
  }, [clicked, menu])

  const close = useCallback(() => setMenu(false), [])

  const itemClick = useCallback(
    item => () => {
      close()
      logEvent('hamburger', item)
    },
    []
  )

  return (
    <div>
      <Button onClick={toggleMobileMenu}>
        <Hamburger open={menu} />
      </Button>

      <Wrapper open={menu}>
        <Top>
          <LocalLink href="/" as={Logo}>
            <img src="/img/logo_white.png" alt="dvc.org" width={34} />
          </LocalLink>
        </Top>
        <Menu>
          <Section>
            <LocalLink
              href="/features"
              as={Link}
              onClick={itemClick('features')}
            >
              Features
            </LocalLink>
          </Section>
          <Section>
            <LocalLink href="/doc" as={Link} onClick={itemClick('doc')}>
              Doc
            </LocalLink>
          </Section>
          <Section>
            <Link href="https://blog.dvc.org/" onClick={itemClick('blog')}>
              Blog
            </Link>
          </Section>
          <Section>
            <LocalLink
              href="/community"
              as={Link}
              onClick={itemClick('community')}
            >
              Community
            </LocalLink>
            <Subsection>
              <LocalLink
                href="/community#meet"
                as={ImageLink}
                onClick={itemClick('community')}
              >
                <Image src="/img/community/icon-community.svg" />
                <ImageComment>Meet Us</ImageComment>
              </LocalLink>
              <LocalLink
                href="/community#contribute"
                as={ImageLink}
                onClick={itemClick('community')}
              >
                <Image src="/img/community/icon-contribute.svg" />
                <ImageComment>Contribute</ImageComment>
              </LocalLink>
              <LocalLink
                href="/community#learn"
                as={ImageLink}
                onClick={itemClick('community')}
              >
                <Image src="/img/community/icon-learn.svg" />
                <ImageComment>Learn</ImageComment>
              </LocalLink>
              <LocalLink
                href="/community#events"
                as={ImageLink}
                onClick={itemClick('community')}
              >
                <Image src="/img/community/icon-events.svg" />
                <ImageComment>Events</ImageComment>
              </LocalLink>
            </Subsection>
          </Section>
          <Section>
            <LocalLink href="/support" as={Link} onClick={itemClick('support')}>
              Support
            </LocalLink>
            <Subsection>
              <ImageLink
                href="mailto:support@dvc.org"
                target="_blank"
                rel="noreferrer noopener"
                click={itemClick('mail')}
              >
                <Image src="/img/community/icon-mail.svg" />
                <ImageComment>E-Mail</ImageComment>
              </ImageLink>
              <ImageLink
                href="https://github.com/iterative/dvc"
                click={itemClick('github')}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Image src="/img/community/icon-github.svg" />
                <ImageComment>GitHub</ImageComment>
              </ImageLink>
              <ImageLink
                href="/chat"
                click={itemClick('chat')}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Image src="/img/community/icon-discord.svg" />
                <ImageComment>Discord</ImageComment>
              </ImageLink>
              <ImageLink
                href="https://twitter.com/DVCorg"
                click={itemClick('twitter')}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Image src="/img/community/icon-twitter.svg" />
                <ImageComment>Twitter</ImageComment>
              </ImageLink>
            </Subsection>
          </Section>
        </Menu>
        <LocalLink
          href="/doc/get-started"
          as={LinkButton}
          onClick={itemClick('get-started')}
        >
          Get started
        </LocalLink>
      </Wrapper>
    </div>
  )
}
