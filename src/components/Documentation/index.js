import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import docsearch from 'docsearch.js'

import 'docsearch.js/dist/cdn/docsearch.css'

import Page from '../Page'
import Hamburger from '../Hamburger'
import SearchForm from '../SearchForm'
import SidebarMenu from './SidebarMenu'
import Markdown, { extractSlugFromTitle } from './Markdown'
import RightPanel from './RightPanel'

import { structure } from '../../utils/sidebar'

import { Backdrop, Container, SearchArea, Side, SideToggle } from './styles'

const ROOT_ELEMENT = 'bodybag'
const SIDEBAR_MENU = 'sidebar-menu'

const parseHeadings = text => {
  const headingRegex = /\n(## \s*)(.*)/g
  const matches = []
  let match
  do {
    match = headingRegex.exec(text)
    if (match) {
      const [title, slug] = extractSlugFromTitle(match[2])
      matches.push({
        text: title,
        slug: slug
      })
    }
  } while (match)

  return matches
}

export default function Documentation({
  source,
  path,
  next,
  prev,
  tutorials,
  markdown
}) {
  const headings = useMemo(() => parseHeadings(markdown))
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

  useEffect(() => {
    const handleRouteChange = () => {
      const rootElement = document.getElementById(ROOT_ELEMENT)
      if (rootElement) {
        rootElement.scrollTop = 0
      }
    }

    Router.events.on('routeChangeComplete', handleRouteChange)

    return () => Router.events.off('routeChangeComplete', handleRouteChange)
  }, [])

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
          markdown={markdown}
          githubLink={githubLink}
          prev={prev}
          next={next}
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
  source: PropTypes.string,
  path: PropTypes.string,
  next: PropTypes.string,
  prev: PropTypes.string,
  tutorials: PropTypes.object,
  markdown: PropTypes.string,
  errorCode: PropTypes.number
}
