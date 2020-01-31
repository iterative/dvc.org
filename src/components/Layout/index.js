import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'

import TopMenu from '../TopMenu'
import Footer from '../Footer'
import HamburgerMenu from '../HamburgerMenu'

import { initGA, logPageView } from '../../utils/ga'

import { Wrapper, Bodybag, ModalRoot } from './styles'

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
