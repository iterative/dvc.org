/* global docsearch:readonly */

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Router from 'next/router'

import Page from '../Page'
import Hamburger from '../Hamburger'
import SearchForm from '../SearchForm'

import SidebarMenu from './SidebarMenu'
import Markdown, { extractSlugFromTitle } from './Markdown'
import RightPanel from './RightPanel'

import { structure } from '../../utils/sidebar'

import { media } from '../../styles'

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
    <Page stickHeader={true}>
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

const Container = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  z-index: 2;

  &:before {
    content: '';
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 50%;
    background-color: #eef4f8;
    z-index: -1;
    pointer-events: none;
  }
`

const Backdrop = styled.div`
  display: none;

  ${media.phablet`
    display: block;
    opacity: 0;
    pointer-events: none;
    transition: opacity .3s linear;

    ${props =>
      props.visible &&
      `
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 1;
      opacity: 1;
      pointer-events: all;
    `}
  `};
`

const Side = styled.div`
  width: 280px;
  background-color: #eef4f8;

  @media only screen and (max-width: 1200px) {
    padding-left: 15px;
  }

  ${media.phablet`
    position: fixed;
    display: block;
    z-index: 2;
    top: 78px;
    bottom: 0;
    left: 0;
    right: 60px;
    box-shadow: rgba(0, 0, 0, 0.14) 0px 0px 4px, rgba(0, 0, 0, 0.28) 0px 4px 8px;
    transform: translateX(-110%);
    transition: transform .35s ease;

    ${props =>
      props.isOpen &&
      `
      transform: translateX(0);
    `}
  `};
`

const SearchArea = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #eef4f8;
  z-index: 10;
  position: sticky;
  top: 0;

  ${media.phablet`
    position: relative;
    padding: 0 20px;
  `};

  form {
    height: 40px;
  }
`

const SideToggle = styled.div`
  display: none;
  position: fixed;
  z-index: 2;
  left: 8px;
  bottom: 20px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0px 9px 0 rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  justify-content: center;
  align-items: center;

  ${media.phablet`
    display: flex;

    > div {
      transform: scale(0.75);
    }
  `};

  ${({ isMenuOpen }) =>
    isMenuOpen &&
    `
    transform: translateX(calc(100vw - 60px));
  `};
`
