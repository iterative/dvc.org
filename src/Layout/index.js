import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import TopMenu from '../TopMenu'
import Footer from '../Footer'
import HamburgerMenu from '../HamburgerMenu'

import { initGA, logPageView } from '../utils/ga'

export default function Layout({ children, enableSmoothScroll }) {
  const router = useRouter()
  const isDocPage = router.pathname === '/doc'

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }

    // Apperently next/head is using promises and because of that
    // it updates after page is already rendered and useEffect is called,
    // because of that we use rAF to place GA call after head update
    requestAnimationFrame(() => logPageView())
  }, [router.asPath])

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
  enableSmoothScroll: PropTypes.bool
}

const Wrapper = styled.div`
  overflow: hidden;
`

const Bodybag = styled.div`
  position: fixed;
  top: 80px;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  transition: top 0.2s linear;
  -webkit-overflow-scrolling: touch;

  ${({ enableSmoothScroll }) =>
    enableSmoothScroll &&
    `
    scroll-behavior: smooth;
    will-change: scroll-position;
  `}
`

const ModalRoot = styled.div`
  position: fixed;
  z-index: 100000;
`
