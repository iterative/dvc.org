import cn from 'classnames'
import React from 'react'

import { LayoutModifiers, ILayoutModifiable } from '../MainLayout'
import LayoutWidthContainer from '../LayoutWidthContainer'
import Link from '../Link'
import Nav from './Nav'

import { useHeaderIsScrolled } from '../../utils/scroll'
import { ReactComponent as LogoSVG } from '../../../static/img/logo.svg'
import styles from './styles.module.css'

const LayoutHeader: React.SFC<Required<ILayoutModifiable>> = ({
  modifiers
}) => {
  const hasCollapsedModifier = modifiers.includes(LayoutModifiers.Collapsed)
  const collapsed = hasCollapsedModifier || useHeaderIsScrolled()

  return (
    <header
      className={styles.wrapper}
      id="header"
      data-collapsed={hasCollapsedModifier}
    >
      <div
        className={cn(
          styles.placeholder,
          hasCollapsedModifier && styles.collapsed
        )}
      />
      <div className={styles.header}>
        <LayoutWidthContainer
          className={cn(styles.container, collapsed && styles.collapsed)}
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
