import React from 'react'
import PropTypes from 'prop-types'

import TopMenu from '../TopMenu'
import Footer from '../Footer'
import HamburgerMenu from '../HamburgerMenu'

import { Wrapper, Bodybag, ModalRoot } from './styles'

import './fonts/fonts.css'

export default function Layout({ children, enableSmoothScroll, isDocPage }) {
  return (
    <Wrapper>
      <TopMenu isDocPage={isDocPage} />
      <HamburgerMenu />
      <Bodybag id="bodybag" enableSmoothScroll={enableSmoothScroll}>
        {children}
        <Footer isDocPage={isDocPage} />
      </Bodybag>
      <ModalRoot id="modal-root"></ModalRoot>
    </Wrapper>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  enableSmoothScroll: PropTypes.bool,
  isDocPage: PropTypes.bool
}
