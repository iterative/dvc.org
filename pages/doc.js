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
import PerfectScrollbar from 'perfect-scrollbar'
import Hamburger from '../src/Hamburger'
// utils
import fetch from 'isomorphic-fetch'
import kebabCase from 'lodash.kebabcase'
import compact from 'lodash.compact'
import { scroller, animateScroll } from 'react-scroll'
import 'core-js/fn/array/find-index'
// styles
import styled from 'styled-components'
import { media } from '../src/styles'
// json
import sidebar from '../src/Documentation/sidebar'
import SidebarHelper from '../src/Documentation/SidebarMenu/SidebarHelper'

export default class Documentation extends Component {
  constructor() {
    super()
    this.state = {
      currentSection: 0,
      currentFile: null,
      markdown: '',
      headings: [],
      pageNotFound: false,
      isMenuOpen: false,
      load: false
    }
  }

  componentDidMount() {
    this.loadStateFromURL()
    SidebarHelper.initDocsearch()
    window.addEventListener('popstate', this.loadStateFromURL)
    this.ps = new PerfectScrollbar('#sidebar-menu', {
      // wheelPropagation: window.innerWidth <= 572
      wheelPropagation: true
    })
  }

  componentDidUpdate() {
    this.ps.update()
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.loadStateFromURL)
  }

  loadStateFromURL = () => {
    let path = window.location.pathname.split('/')
    let length = path.length
    let { file, indexes } = SidebarHelper.getFileFromUrl(path)
    this.loadFile({
      section: length > 2 ? indexes[0] : 0,
      subsection: indexes.length > 2 ? indexes[1] : null,
      file: file,
      setHeadings: true
    })
  }

  getLinkHref = (section, subsection = null, file = null) => {
    let sect = sidebar[section]
    let removeExtFunc = filename =>
      SidebarHelper.removeExtensionFromFileName(filename)
    const sectionSlug = removeExtFunc(sect.indexFile) || kebabCase(sect.name)
    const subsectionSlug =
      (subsection && removeExtFunc(sect.files[subsection].indexFile)) ||
      sect.files[subsection]
    const fileSlug = removeExtFunc(file) || (file && file.files[0])
    return `/doc/${compact([sectionSlug, subsectionSlug, fileSlug]).join('/')}`
  }

  setCurrentPath = (section, subsection, file) => {
    window.history.pushState(
      null,
      null,
      this.getLinkHref(section, subsection, file)
    )
  }

  onSectionSelect = (section, e) => {
    e && e.preventDefault()
    const file = sidebar[section].indexFile || sidebar[section].files[0]
    e && this.setCurrentPath(section)
    this.loadFile({ section, file, setHeadings: false })
  }

  onFileSelect = (section, subsection, file, e) => {
    e && e.preventDefault()
    this.setCurrentPath(section, subsection, file.indexFile || file)
    this.loadFile({ section, subsection, file, setHeadings: true })
  }

  updateStateWithCurrentFile = (
    markdown,
    currentSection,
    currentFile,
    setHeadings
  ) => {
    this.setState(
      {
        currentSection,
        currentFile,
        markdown,
        headings: [],
        pageNotFound: false,
        isMenuOpen: false,
        load: false
      },
      () => {
        SidebarHelper.scrollTop()
        setHeadings && this.setHeadings(markdown)
      }
    )
  }

  setCurrentFile = (
    section,
    subsection,
    file,
    folderpath,
    filepath,
    setHeadings
  ) => {
    const helper = SidebarHelper
    fetch(helper.combineToPath([folderpath, filepath]))
      .then(res => {
        res.text().then(markdown => {
          const currentFile =
            helper.getFullPath(folderpath, file) ||
            helper.getPath(section, subsection, file)
          this.updateStateWithCurrentFile(
            markdown,
            section,
            currentFile,
            setHeadings
          )
        })
      })
      .catch(() => {
        window.location.reload()
      })
  }

  loadFile = ({ section, subsection, file, setHeadings }) => {
    this.setState({ load: true })
    let sect = sidebar[section]
    let subsect = sect.files[subsection]
    let subfolder = subsect && subsect.folder
    let folderpath = file.folder || subfolder || sect.folder
    let filepath = file.indexFile || file.files || file
    this.setCurrentFile(
      section,
      subsection,
      file,
      folderpath,
      filepath,
      setHeadings
    )
  }

  setHeadings = text => {
    let matches = SidebarHelper.parseHeadings(text)
    this.setState({ headings: matches }, SidebarHelper.autoScroll)
  }

  toggleMenu = () => {
    this.setState(prevState => ({
      isMenuOpen: !prevState.isMenuOpen
    }))
  }

  render() {
    const {
      currentSection,
      currentFile,
      headings,
      markdown,
      pageNotFound,
      isMenuOpen,
      load
    } = this.state

    const directory = sidebar[currentSection].folder
    const githubLink = `https://github.com/iterative/dvc.org/blob/master${directory}/${currentFile}`
    const sectionName = sidebar[currentSection].indexFile

    return (
      <Page stickHeader={true}>
        <HeadInjector sectionName={sectionName} />
        <Container>
          <Backdrop onClick={this.toggleMenu} visible={isMenuOpen} />

          <SideToggle onClick={this.toggleMenu} isMenuOpen={isMenuOpen}>
            <Hamburger />
          </SideToggle>

          <Side isOpen={isMenuOpen}>
            <SearchArea>
              <SearchForm />
            </SearchArea>

            <SidebarMenu
              sidebar={sidebar}
              currentSection={currentSection}
              currentFile={currentFile}
              headings={headings}
              getLinkHref={this.getLinkHref}
              onSectionSelect={this.onSectionSelect}
              onFileSelect={this.onFileSelect}
            />
          </Side>

          {pageNotFound ? (
            <Page404 />
          ) : (
            <Markdown
              markdown={markdown}
              githubLink={githubLink}
              section={currentSection}
              file={currentFile}
              load={load}
              onFileSelect={this.onFileSelect}
            />
          )}

          <RightPanel headings={headings} githubLink={githubLink} />
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
