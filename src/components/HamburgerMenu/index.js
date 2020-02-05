import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Hamburger from '../Hamburger'
import LocalLink from '../LocalLink'

import { logEvent } from '../../utils/ga'

import {
  Button,
  Column,
  Columns,
  Heading,
  Link,
  Links,
  Logo,
  Menu,
  Section,
  Top,
  Wrapper
} from './styles'

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
                <LocalLink href="/" as={Logo}>
                  <img
                    src="/static/img/logo_white.png"
                    alt="dvc.org"
                    width={34}
                  />
                </LocalLink>
              </Top>

              <Columns>
                <Column>
                  <Heading>Product</Heading>
                  <Links>
                    <LocalLink href="/" as={Link} onClick={this.scrollToTop}>
                      Overview
                    </LocalLink>
                    <LocalLink
                      href="/features"
                      as={Link}
                      onClick={this.itemClick('features')}
                    >
                      Features
                    </LocalLink>
                  </Links>
                </Column>
                <Column>
                  <Heading>Help</Heading>
                  <Links>
                    <LocalLink
                      href="/support"
                      as={Link}
                      onClick={this.itemClick('support')}
                    >
                      Support
                    </LocalLink>
                    <LocalLink
                      href="/doc/get-started"
                      as={Link}
                      onClick={this.itemClick('get-started')}
                    >
                      Get started
                    </LocalLink>
                    <LocalLink
                      href="/community"
                      as={Link}
                      onClick={this.itemClick('community')}
                    >
                      Community
                    </LocalLink>
                    <LocalLink
                      href="/doc"
                      as={Link}
                      onClick={this.itemClick('doc')}
                    >
                      Documentation
                    </LocalLink>
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
                      href="https://twitter.com/DVCorg "
                      click={this.itemClick('twitter')}
                    >
                      Twitter
                    </SocialLink>
                    <SocialLink
                      src="/static/img/github.png"
                      href="https://github.com/iterative/dvc"
                      click={this.itemClick('github')}
                    >
                      GitHub
                    </SocialLink>
                    <SocialLink
                      src="/static/img/discord.png"
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
