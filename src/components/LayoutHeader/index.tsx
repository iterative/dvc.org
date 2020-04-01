import cn from 'classnames'
import React from 'react'
import { useWindowScroll } from 'react-use'

import { LayoutModifiers, ILayoutModifiable } from '../MainLayout'
import LayoutWidthContainer from '../LayoutWidthContainer'
import Link from '../Link'
import Nav from './Nav'

import { ReactComponent as LogoSVG } from '../../../static/img/logo.svg'
import styles from './styles.module.css'

const LayoutHeader: React.SFC<Required<ILayoutModifiable>> = ({
  modifiers
}) => {
  const hasScrolledModifier = modifiers.includes(LayoutModifiers.Scrolled)
  const scrolled =
    hasScrolledModifier ||
    (() => {
      const { y } = useWindowScroll()

      return y > 25
    })()

  return (
    <header className={styles.wrapper} id="header">
      <div
        className={cn(
          styles.placeholder,
          hasScrolledModifier && styles.scrolled
        )}
      />
      <div className={styles.header}>
        <LayoutWidthContainer
          className={cn(styles.container, scrolled && styles.scrolled)}
          wide={modifiers.includes(LayoutModifiers.Wide)}
        >
          <Link href="/" className={styles.logoLink} title="DVC">
            <LogoSVG className={styles.logo} />
          </Link>
          <Nav />
        </LayoutWidthContainer>
      </div>
    </header>
  )
}

export default LayoutHeader
