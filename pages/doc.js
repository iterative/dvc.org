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
import flatten from 'lodash.flatten'
import { scroller, animateScroll } from 'react-scroll'
import 'core-js/fn/array/find-index'
// styles
import styled from 'styled-components'
import { media } from '../src/styles'
// json
import sidebar from '../src/Documentation/sidebar'

export default class Documentation extends Component {
  constructor() {
    super()
    this.state = {
      currentSection: 0,
      currentFile: null,
      markdown: '',
      headings: [],
      pageNotFound: false,
      isMenuOpen: false
    }
  }

  componentDidMount() {
    this.loadStateFromURL()
    this.initDocsearch()
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
    const { pathname } = window.location;
    const sectionURL = pathname.split('/')[2];
    const sectionIndex = sidebar.findIndex(
      section => kebabCase(section.name) === sectionURL
    );
    if (sectionIndex === -1) {
      this.setState({ pageNotFound: true })
    } else {
      const fileURL = pathname.split('/')[3]; // match file from URL
      const section = sidebar[sectionIndex];
      if(fileURL){
        if(pathname.split('/')[4]){
          let subsectionIndex = section.files.findIndex(
            file => kebabCase(file.indexFile.slice(0, -3)) === fileURL
          );
          let fileIndex = section.files[subsectionIndex].files.findIndex(
            file => kebabCase(file.indexFile.slice(0, -3)) === pathname.split('/')[4]
          );
          this.loadFile({
            file: section.files[subsectionIndex].files[fileIndex],
            section: sectionIndex,
            parseHeadings: true,
          })
        }else{
          let fileIndex = section.files.findIndex(
            file => kebabCase(file.indexFile.slice(0, -3)) === fileURL
          );
          if (fileIndex === -1) {
            let fileIndex2=-1, subsectionIndex=0;
            section.files.map((subsection,index2)=>{
              if (subsection.files.length>0){
                fileIndex2 = subsection.files.findIndex(
                  file2 => {
                    if(kebabCase(file2.indexFile.slice(0, -3)) === fileURL){
                      subsectionIndex = index2;
                    }
                    return kebabCase(file2.indexFile.slice(0, -3)) === fileURL
                  }
                );
              }
            });
            if (fileIndex2 === -1){
              fileURL ? this.setState({ pageNotFound: true }) : this.onSectionSelect(sectionIndex)
            }else{
              this.loadFile({
                file: section.files[subsectionIndex].files[fileIndex2],
                section: sectionIndex,
                parseHeadings: true,
              })
            }
          }else{
            this.loadFile({
              file: section.files[fileIndex],
              section: sectionIndex,
              parseHeadings: true,
            })
          }
        }
      }else{
        this.loadFile({ file:section.hasOwnProperty('indexFile') ? section : section.files[0], section: sectionIndex, parseHeadings: false });
      }
    }
  };

  initDocsearch = () => {
    docsearch({
      apiKey: '755929839e113a981f481601c4f52082',
      indexName: 'dvc',
      inputSelector: '#doc-search',
      debug: false // Set debug to true if you want to inspect the dropdown
    })
  };

  getLinkHref = (section, file, subsection=null) => {
    const sectionSlug = kebabCase(sidebar[section].name);
    const fileSlug = file ? file.slice(0, -3) : undefined;
    let subsectionSlug = subsection ? sidebar[section].files[subsection].indexFile.slice(0,-3) : '';
    return `/doc/${compact([sectionSlug, subsectionSlug, fileSlug]).join('/')}`;
  };

  setCurrentPath = (section, file, subsection) => {
    window.history.pushState(null, null, this.getLinkHref(section, file, subsection))
  };

  onSectionSelect = (section, e) => {
    e && e.preventDefault();
    const file = sidebar[section].hasOwnProperty('indexFile') ? sidebar[section]  : sidebar[section].files[0];
    e && this.setCurrentPath(section);
    this.loadFile({ file, section, parseHeadings: false });
  };

  onFileSelect = (file, section, e, subsection) => {
    e && e.preventDefault();
    this.setCurrentPath(section, file.indexFile, subsection);
    this.loadFile({ file, section, parseHeadings: true });
  };

  loadFile = ({ file, section, parseHeadings }) => {
    this.setState({currentFile:'load'});
    fetch(`${file.folder}/${file.indexFile}`)
      .then(res => {
        res.text().then(text => {
          this.setState(
            {
              currentSection: section,
              currentFile: file.indexFile,
              markdown: text,
              headings: [],
              pageNotFound: false,
              isMenuOpen: false
            },
            () => {
              this.scrollTop()
              parseHeadings && this.parseHeadings(text)
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
      currentSection,
      currentFile,
      headings,
      markdown,
      pageNotFound,
      isMenuOpen
    } = this.state

    const directory = sidebar[currentSection].folder
    const githubLink = `https://github.com/iterative/dvc.org/blob/master${directory}/${currentFile}`
    const sectionName = sidebar[currentSection].name

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
              scrollToLink={this.scrollToLink}
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
              onFileSelect={this.onFileSelect}
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
