import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import throttle from 'lodash.throttle'

import Nav from '../Nav'

import { HEADER } from '../../consts'

import { Container, Logo, Wrapper } from './styles'

export default class TopMenu extends Component {
  constructor() {
    super()
    this.state = {
      scrolled: false
    }
    this.handleScrollThrottled = throttle(this.handleScroll, 300)
  }

  componentDidMount() {
    this.bodybag = document.getElementById('bodybag')
    this.isPhablet = window.innerWidth <= 572

    if (!this.isPhablet) {
      this.bodybag.addEventListener('scroll', this.handleScrollThrottled)
      this.handleScroll()
    }
  }

  componentWillUnmount() {
    if (!this.isPhablet) {
      this.bodybag.removeEventListener('scroll', this.handleScrollThrottled)
    }
  }

  handleScroll = e => {
    if (this.props.isDocPage) return
    const scrollTop = e ? e.target.scrollTop : 0
    this.setState({
      scrolled: scrollTop > 25
    })
  }

  render() {
    const { isDocPage } = this.props
    const { scrolled } = this.state

    return (
      <Wrapper>
        <Container
          id={HEADER}
          scrolled={isDocPage || scrolled}
          wide={isDocPage}
        >
          <NextLink href="/" passHref>
            <Logo>
              <img
                src="/static/img/logo.png"
                alt="dvc.org"
                width={36}
                height={23}
              />
            </Logo>
          </NextLink>
          <Nav mobile={false} />
        </Container>
      </Wrapper>
    )
  }
}

TopMenu.propTypes = {
  isDocPage: PropTypes.bool
}
