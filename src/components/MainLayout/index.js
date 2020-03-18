import React from 'react'
import PropTypes from 'prop-types'

import TopMenu from '../TopMenu'
import Footer from '../Footer'
import HamburgerMenu from '../HamburgerMenu'

import { Wrapper, Bodybag, ModalRoot } from './styles'
export default function MainLayout({
  children,
  enableSmoothScroll,
  isDocPage = false
}) {
  return (
    <>
      <Wrapper>
        <TopMenu isDocPage={isDocPage} />
        <HamburgerMenu />
        <Bodybag id="bodybag" enableSmoothScroll={enableSmoothScroll}>
          {children}
          <Footer isDocPage={isDocPage} />
        </Bodybag>
        <ModalRoot id="modal-root"></ModalRoot>
      </Wrapper>
    </>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  enableSmoothScroll: PropTypes.bool,
  isDocPage: PropTypes.bool
}
