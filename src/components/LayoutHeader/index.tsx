import cn from 'classnames'
import React from 'react'
import includes from 'lodash/includes'

import { LayoutModifiers, ILayoutModifiable } from '../MainLayout'
import LayoutWidthContainer from '../LayoutWidthContainer'
import Link from '../Link'
import Nav from './Nav'
import {
  HamburgerMenu,
  HamburgerButton,
  useHamburgerMenu
} from '../HamburgerMenu'

import { useHeaderIsScrolled } from '../../utils/front/scroll'
import { ReactComponent as LogoSVG } from '../../../static/img/dvc_icon-color--square_vector.svg'
import styles from './styles.module.css'

import LayoutAlert from './alert'

const LayoutHeader: React.FC<Required<ILayoutModifiable>> = ({ modifiers }) => {
  const { opened, handleToggle, handleItemClick } = useHamburgerMenu()
  const scrolled = useHeaderIsScrolled()
  const hasCollapsedModifier = includes(modifiers, LayoutModifiers.Collapsed)
  const hasHideAlertModifier = includes(modifiers, LayoutModifiers.HideAlert)
  const collapsed = opened || hasCollapsedModifier || scrolled

  return (
    <>
      <header className={styles.wrapper} id="header" data-collapsed={collapsed}>
        <div
          className={cn(
            styles.placeholder,
            collapsed && styles.collapsed,
            LayoutAlert && styles.withAlert
          )}
        />
        <div className={styles.header}>
          {!hasHideAlertModifier && LayoutAlert && (
            <LayoutAlert collapsed={collapsed} />
          )}
          <LayoutWidthContainer
            className={cn(styles.container, collapsed && styles.collapsed)}
            wide
          >
            <Link
              href="/"
              className={styles.logoLink}
              title="DVC"
              aria-label="DVC"
            >
              <LogoSVG className={styles.logo} />
            </Link>
            <Link
              className={styles.company}
              href="https://iterative.ai/"
              target="_blank"
            >
              by <span className={styles.companyName}>iterative.ai</span>
            </Link>
            <Nav />
          </LayoutWidthContainer>
        </div>
      </header>
      <HamburgerButton
        opened={opened}
        collapsed={collapsed}
        handleClick={handleToggle}
      />
      <HamburgerMenu
        opened={opened}
        collapsed={collapsed}
        handleToggle={handleToggle}
        handleItemClick={handleItemClick}
      />
    </>
  )
}

export default LayoutHeader
