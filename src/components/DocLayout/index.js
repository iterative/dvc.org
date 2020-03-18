/* global docsearch:readonly */

import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Hamburger from '../Hamburger'
import SearchForm from '../SearchForm'
import MainLayout from '../MainLayout'
import SidebarMenu from './SidebarMenu'

import { Container, Backdrop, SearchArea, Side, SideToggle } from './styles'

import { structure } from '../../utils/sidebar'

const SIDEBAR_MENU = 'sidebar-menu'

function DocLayout({ children, ...restProps }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchAvaible, setIsSearchAvaible] = useState(false)

  const toggleMenu = useCallback(() => setIsMenuOpen(!isMenuOpen), [isMenuOpen])

  useEffect(() => {
    try {
      docsearch

      setIsSearchAvaible(true)

      if (docsearch && isSearchAvaible) {
        docsearch({
          apiKey: '755929839e113a981f481601c4f52082',
          indexName: 'dvc',
          inputSelector: '#doc-search',
          debug: false // Set to `true` if you want to inspect the dropdown
        })
      }
    } catch (ReferenceError) {
      // nothing there
    }
  }, [isSearchAvaible])

  return (
    <MainLayout {...restProps} isDocPage>
      <Container>
        <Backdrop onClick={toggleMenu} visible={isMenuOpen} />

        <SideToggle onClick={toggleMenu} isMenuOpen={isMenuOpen}>
          <Hamburger />
        </SideToggle>

        <Side isOpen={isMenuOpen}>
          {isSearchAvaible && (
            <SearchArea>
              <SearchForm />
            </SearchArea>
          )}

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
