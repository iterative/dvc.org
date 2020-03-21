import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import Hamburger from '../Hamburger'
import SearchForm from '../SearchForm'
import MainLayout from '../MainLayout'
import SidebarMenu from './SidebarMenu'

import { Container, Backdrop, Side, SideToggle } from './styles'

import { structure } from '../../utils/sidebar'

const SIDEBAR_MENU = 'sidebar-menu'

function DocLayout({ children, ...restProps }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = useCallback(() => setIsMenuOpen(!isMenuOpen), [isMenuOpen])

  return (
    <MainLayout {...restProps} isDocPage>
      <Container>
        <Backdrop onClick={toggleMenu} visible={isMenuOpen} />

        <SideToggle onClick={toggleMenu} isMenuOpen={isMenuOpen}>
          <Hamburger />
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

DocLayout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  })
}

export default DocLayout
