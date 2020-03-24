import React, { useEffect } from 'react'

import Header from '../Header'
import HamburgerMenu from '../HamburgerMenu'
import Footer from '../Footer'

import styles from './styles.module.css'

interface ILayoutProps {
  children: React.ReactNode
  enableSmoothScroll?: boolean
}

const Layout: React.SFC<ILayoutProps> = ({
  children,
  enableSmoothScroll = false
}) => {
  useEffect(() => {
    document.body.classList.toggle('bodySmoothScrolling', enableSmoothScroll)
  }, [enableSmoothScroll])

  return (
    <div className={styles.layout}>
      <Header />
      <HamburgerMenu />
      {children}
      <Footer />
      <div id="modal-root" className={styles.modalRoot} />
    </div>
  )
}

export default Layout
