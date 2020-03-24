import cn from 'classnames'
import React from 'react'
import { useWindowScroll } from 'react-use'

import Nav from '../Nav'

import { ReactComponent as LogoSVG } from './logo.svg'
import styles from './styles.module.css'

const Header: React.SFC = () => {
  const { y } = useWindowScroll()

  return (
    <div className={styles.wrapper} id="header">
      <div className={styles.header}>
        <div className={cn(styles.container, y > 25 && styles.scrolled)}>
          <a href="/" className={styles.logoLink} title="DVC">
            <LogoSVG className={styles.logo} />
          </a>
          <Nav />
        </div>
      </div>
    </div>
  )
}

export default Header
