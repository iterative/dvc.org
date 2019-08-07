import React, { Component } from 'react'
// nextjs
import { HeadInjector } from '../src/Documentation/HeadInjector'
// components
import SidebarMenu from '../src/Documentation/SidebarMenu/SidebarMenu'
import Markdown from '../src/Documentation/Markdown/Markdown'
import { RightPanel } from '../src/Documentation/RightPanel/RightPanel'
import Page from '../src/Page'
import SearchForm from '../src/SearchForm'
import Page404 from '../src/Page404'
import Hamburger from '../src/Hamburger'
// utils
import fetch from 'isomorphic-fetch'
import kebabCase from 'lodash.kebabcase'
import { scroller, animateScroll } from 'react-scroll'
// styles
import styled from 'styled-components'
import { media } from '../src/styles'
// sidebar data and helpers
import sidebar, { getItemByPath } from '../src/Documentation/SidebarMenu/helper'

export default class Documentation extends Component {
  constructor() {
    super()
    this.state = {
      currentItem: {},
      markdown: '',
      headings: [],
      pageNotFound: false,
      isMenuOpen: false,
      search: false
    }
  }

  componentDidMount() {
    this.loadStateFromURL()
    try {
      docsearch
      this.setState(
        {
          search: true
        },
        () => {
          this.initDocsearch()
        }
      )
    } catch (ReferenceError) {
      this.setState({
        search: false
      })
    }

    window.addEventListener('popstate', this.loadStateFromURL)
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.loadStateFromURL)
  }

  initDocsearch = () => {
    docsearch({
      apiKey: '755929839e113a981f481601c4f52082',
      indexName: 'dvc',
      inputSelector: '#doc-search',
      debug: false // Set debug to true if you want to inspect the dropdown
    })
  }

  onNavigate = (path, e) => {
    e && e.preventDefault()
    window.history.pushState(null, null, path)
    this.loadPath(path)
  }

  loadStateFromURL = () => this.loadPath(window.location.pathname)

  loadPath = path => {
    const item = getItemByPath(path)

    if (!item) {
      this.setState({ pageNotFound: true, currentItem: {} })

      return
    }

    fetch(item.source)
      .then(res => {
        res.text().then(text => {
          this.setState(
            {
              markdown: text,
              headings: [],
              pageNotFound: false,
              isMenuOpen: false,
              currentItem: item
            },
            () => {
              this.scrollTop()
              this.parseHeadings(text)
            }
          )
        })
      })
      .catch(() => {
        window.location.reload()
      })
  }

  parseHeadings = text => {
    const headingRegex = /\n(## \s*)(.*)/g
    const matches = []
    let match
    do {
      match = headingRegex.exec(text)
      if (match)
        matches.push({
          text: match[2],
          slug: kebabCase(match[2])
        })
    } while (match)

    this.setState({ headings: matches }, this.autoScroll)
  }

  autoScroll = () => {
    const { hash } = window.location
    if (hash) this.scrollToLink(hash)
  }

  scrollToLink = href => {
    scroller.scrollTo(href.slice(1), {
      duration: 600,
      offset: -85,
      delay: 0,
      smooth: 'ease',
      containerId: 'bodybag'
    })
  }

  scrollTop = () => {
    animateScroll.scrollTo(0, {
      duration: 300,
      offset: -85,
      delay: 0,
      smooth: 'ease',
      containerId: 'bodybag'
    })
  }

  toggleMenu = () => {
    this.setState(prevState => ({
      isMenuOpen: !prevState.isMenuOpen
    }))
  }

  render() {
    const {
      currentItem: { source, path, label, next, prev },
      headings,
      markdown,
      pageNotFound,
      isMenuOpen
    } = this.state

    const githubLink = `https://github.com/iterative/dvc.org/blob/master${source}`

    return (
      <Page stickHeader={true}>
        <HeadInjector sectionName={label} />
        <Container>
          <Backdrop onClick={this.toggleMenu} visible={isMenuOpen} />

          <SideToggle onClick={this.toggleMenu} isMenuOpen={isMenuOpen}>
            <Hamburger />
          </SideToggle>

          <Side isOpen={isMenuOpen}>
            {this.state.search && (
              <SearchArea>
                <SearchForm />
              </SearchArea>
            )}

            <SidebarMenu
              sidebar={sidebar}
              currentPath={path}
              headings={headings}
              scrollToLink={this.scrollToLink}
              onNavigate={this.onNavigate}
            />
          </Side>

          {pageNotFound ? (
            <Page404 />
          ) : (
            <Markdown
              markdown={markdown}
              githubLink={githubLink}
              prev={prev}
              next={next}
              onNavigate={this.onNavigate}
            />
          )}
          <RightPanel
            headings={headings}
            scrollToLink={this.scrollToLink}
            githubLink={githubLink}
          />
        </Container>
      </Page>
    )
  }
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
