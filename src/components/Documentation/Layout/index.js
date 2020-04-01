import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import MainLayout, { LayoutModifiers } from '../../MainLayout'
import HamburgerIcon from '../../HamburgerIcon'
import SearchForm from './SearchForm'
import SidebarMenu from './SidebarMenu'

import { Container, Backdrop, Side, SideToggle } from './styles'

import { structure } from '../../../utils/sidebar'

const SIDEBAR_MENU = 'sidebar-menu'

function Layout({ children, ...restProps }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = useCallback(() => setIsMenuOpen(!isMenuOpen), [isMenuOpen])

  return (
    <MainLayout
      {...restProps}
      modifiers={[LayoutModifiers.Wide, LayoutModifiers.Scrolled]}
    >
      <Container>
        <Backdrop onClick={toggleMenu} visible={isMenuOpen} />

        <SideToggle onClick={toggleMenu} isMenuOpen={isMenuOpen}>
          <HamburgerIcon />
        </SideToggle>

        <Side isOpen={isMenuOpen}>
          <SearchForm />
          <SidebarMenu
            sidebar={structure}
            currentPath={restProps.location.pathname}
            id={SIDEBAR_MENU}
            onClick={toggleMenu}
          />
        </Side>
        {children}
      </Container>
    </MainLayout>
  )
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  })
}

export default Layout
