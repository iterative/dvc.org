/* global docsearch:readonly */

import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Page from '../Page'
import Hamburger from '../Hamburger'
import SearchForm from '../SearchForm'
import SidebarMenu from './SidebarMenu'
import Markdown from './NewMarkdown'
import RightPanel from './RightPanel'

import { structure, getItemByPath } from '../../utils/sidebar'

import { Backdrop, Container, SearchArea, Side, SideToggle } from './styles'

const ROOT_ELEMENT = 'bodybag'
const SIDEBAR_MENU = 'sidebar-menu'

export default function Documentation({ html, path, headings }) {
  const { source, prev, next, tutorials } = getItemByPath(path)

  // const headings = useMemo(() => parseHeadings(markdown))
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchAvaible, setIsSearchAvaible] = useState(false)

  const toggleMenu = useCallback(() => setIsMenuOpen(!isMenuOpen), [isMenuOpen])

  useEffect(() => {
    try {
      docsearch

      setIsSearchAvaible(true)

      if (isSearchAvaible) {
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

  const githubLink = `https://github.com/iterative/dvc.org/blob/master/public${source}`

  return (
    <Page stickHeader={true} isDocPage={true}>
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
            currentPath={path}
            id={SIDEBAR_MENU}
            onClick={toggleMenu}
          />
        </Side>
        <Markdown
          html={html}
          prev={prev}
          next={next}
          githubLink={githubLink}
          tutorials={tutorials}
        />
        <RightPanel
          headings={headings}
          githubLink={githubLink}
          tutorials={tutorials}
        />
      </Container>
    </Page>
  )
}

Documentation.propTypes = {
  path: PropTypes.string,
  headings: PropTypes.array,
  html: PropTypes.string
}
