import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'

import MainLayout, { LayoutComponent, LayoutModifiers } from '../../MainLayout'
import LayoutWidthContainer from '../../LayoutWidthContainer'
import HamburgerIcon from '../../HamburgerIcon'
import SearchForm from './SearchForm'
import SidebarMenu from './SidebarMenu'
import { matchMedia } from '../../../utils/front/breakpoints'
import { focusElementWithHotkey } from '../../../utils/front/focusElementWithHotkey'

import styles from './styles.module.css'
import { useWindowSize } from 'react-use'

const Layout: LayoutComponent = ({ children, ...restProps }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {
    location: { pathname }
  } = restProps

  const toggleMenu = useCallback(() => setIsMenuOpen(!isMenuOpen), [isMenuOpen])

  const windowSize = useWindowSize()

  useEffect(() => {
    if (matchMedia('--xs-scr')) {
      return
    }
    const closeEventListener = focusElementWithHotkey('#doc-search', '/')
    return closeEventListener
  }, [windowSize])

  return (
    <MainLayout
      {...restProps}
      modifiers={[LayoutModifiers.Wide, LayoutModifiers.Collapsed]}
    >
      <LayoutWidthContainer className={styles.container} wide>
        {/* eslint-disable jsx-a11y/no-static-element-interactions */}
        {/* eslint-disable jsx-a11y/click-events-have-key-events */}
        <div
          className={cn(styles.backdrop, isMenuOpen && styles.opened)}
          onClick={toggleMenu}
        />
        {/* eslint-enable jsx-a11y/no-static-element-interactions */}
        {/* eslint-enable jsx-a11y/click-events-have-key-events */}

        <button
          className={cn(styles.sideToggle, isMenuOpen && styles.opened)}
          onClick={toggleMenu}
        >
          <HamburgerIcon />
        </button>

        <div className={cn(styles.side, isMenuOpen && styles.opened)}>
          <SearchForm />
          <SidebarMenu
            currentPath={pathname}
            onClick={(isLeafItemClicked: boolean): void => {
              if (matchMedia('--xs-scr') && isLeafItemClicked) {
                toggleMenu()
              }
            }}
          />
        </div>
        <div className={styles.content}>{children}</div>
      </LayoutWidthContainer>
    </MainLayout>
  )
}

export default Layout
