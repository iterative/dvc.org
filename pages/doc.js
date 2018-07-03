import React, { Component } from 'react'
// components
import ReactMarkdown from 'react-markdown'
import Page from '../src/Page'
import SearchForm from '../src/SearchForm'
import DownloadButton from '../src/DownloadButton'
// code highlighter
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/light'
import docco from 'react-syntax-highlighter/styles/hljs/docco'
import js from 'react-syntax-highlighter/languages/hljs/javascript'
import python from 'react-syntax-highlighter/languages/hljs/python'
import bash from 'react-syntax-highlighter/languages/hljs/bash'
// utils
import fetch from 'isomorphic-fetch'
import kebabCase from 'lodash.kebabcase'
import startCase from 'lodash.startcase'
import { scroller, animateScroll } from 'react-scroll'
// styles
import styled from 'styled-components'
import { media, OnlyDesktop } from '../src/styles'
// documentation
import sidebar from '../src/Documentation/sidebar'

registerLanguage('js', js)
registerLanguage('python', python)
registerLanguage('sh', bash)

function flatten(text, child) {
  return typeof child === 'string'
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text)
}

const HeadingRenderer = ({ level, children }) => {
  const content = React.Children.toArray(children);
  const text = children.reduce(flatten, '')
  const slug = kebabCase(text)
  return React.createElement('h' + level, { id: slug }, content)
}

const CodeBlock = ({ value, language }) => (
  <SyntaxHighlighter
    language={language}
    style={docco}
  >
    {value}
  </SyntaxHighlighter>  
)

export default class Documentation extends Component {
  state = {
    currentSection: 0,
    currentFile: null,
    markdown: '',
    headings: [],
  }

  componentDidMount() {
    const { hash } =  window.location
    const file = hash.slice(1) + '.md'
    const section = sidebar.findIndex((section) => section.files.includes(file))
    if (section !== -1) {
      this.setState({ currentSection: section }, () => this.onFileSelect(file, section))
    } else {
      this.onSectionSelect(0)
    }
  }

  onSectionSelect = (idx) => {
    const { indexFile, files } = sidebar[idx]
    window.history.pushState(null, null, window.location.pathname)
    this.onFileSelect(indexFile || files[0], idx, indexFile)
    this.setState({
      currentSection: idx,
    })
  }

  onFileSelect = (file, section, isIndexFile) => {
    const src = `${sidebar[section].folder}/${file}`
    isIndexFile || window.history.pushState(null, null, `#${file.slice(0, -3)}`)
    fetch(src).then(res => {
      res.text().then(text => {
        this.setState({
          currentFile: file,
          markdown: text,
          headings: [],
        }, () => {
          this.scrollTop();
          isIndexFile || this.parseHeadings(text);
        })
      })
    })
  }

  parseHeadings = (text) => {
    const headingRegex = /\n(## \s*)(.*)/g;
    const matches = [];
    let match;
    do {
        match = headingRegex.exec(text);
        if (match) matches.push({
          text: match[2],
          slug: kebabCase(match[2])
        })
    } while (match);

    this.setState({
      headings: matches,
    })
  }

  scrollToLink = (href) => () => {
    scroller.scrollTo(href.slice(1), {
      duration: 500,
      offset: -85,
      delay: 0,
      smooth: 'easeInOut',
    })
  }

  scrollTop = () => {
    animateScroll.scrollTo(0, {
      duration: 300,
      offset: -85,
      delay: 0,
      smooth: 'easeInOut',
    })
  }

  render() {
    const { currentSection, currentFile, markdown, headings } = this.state

    return (
      <Page stickHeader={true}>
        <Container>
          <Side>
            <Menu>
              <SidebarHeading>Documentation</SidebarHeading>

              {/* Search */}
              <SearchArea>
                <SearchForm />
              </SearchArea>

              {/* Sections */}
              <Sections>
                <SectionLinks>
                  {
                    sidebar.map(({ name, files = [] }, index) => {
                      const isSectionActive = currentSection === index;
                      return (
                        <div key={index}>
                          <SectionLink
                            level={1} 
                            onClick={() => this.onSectionSelect(index)} 
                            isActive={isSectionActive}
                          >
                            {name}
                          </SectionLink>

                          {/* Section Files */}
                          <Collapse isOpen={isSectionActive} items={files.length + headings.length}>
                            {files && files.map((file, fileIndex) => {
                              const isFileActive = currentFile === file;
                              return (
                                <div key={`file-${fileIndex}`}>
                                  <SectionLink 
                                    level={2} 
                                    onClick={() => this.onFileSelect(file, index)}
                                    isActive={isFileActive}
                                    href={`#${file.slice(0, -3)}`}
                                  >
                                    {startCase(file.slice(0, -3))}
                                  </SectionLink>

                                  {/* File Headings */}
                                  <Collapse isOpen={isFileActive} items={headings.length}>
                                    {!!headings.length && headings.map(({ text, slug }, headingIndex) => (
                                      <SectionLink 
                                        level={3}
                                        key={`link-${headingIndex}`}
                                        onClick={this.scrollToLink('#' + slug)}
                                      >
                                        {text}
                                      </SectionLink>
                                    ))}
                                  </Collapse>
                                </div>
                              )}
                            )}
                          </Collapse>
                        </div>
                      )
                    })
                  }
                </SectionLinks>
              </Sections>

              <OnlyDesktop>
                <DownloadButton />
              </OnlyDesktop>
            </Menu>
          </Side>

          <Content>
            <ReactMarkdown 
              className="markdown-body"
              source={markdown}
              renderers={{
                code: CodeBlock,
                heading: HeadingRenderer,
              }}
            />
          </Content>
        </Container>
      </Page>
    )
  }
}

const Container = styled.div`
  margin-top: 93px;
  display: flex;
  flex-direction: row;
  min-height: 80vh;
  margin-left: auto;
  margin-right: auto;

  ${media.phablet`
    margin-top: 63px;
    flex-direction: column;
  `};
`

const Side = styled.div`
  flex-basis: 35.7%;
  display: flex;
  justify-content: flex-end;
  background-color: #eef4f8;
  padding: 20px 10px 30px 0;

  ${media.phablet`
    flex-basis: auto;
    flex: 1;
  `};
`

const Menu = styled.div`
  max-width: 280px;
  margin-right: 18px;

  ${media.phablet`
    padding: 30px;
    width: 100%;
    max-width: none;
    margin-right: 0px;
  `};
`

const SidebarHeading = styled.h3`
  font-size: 24px;
  color: #b0b8c5;
`

const SearchArea = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  min-width: 280px;
  height: 44px;
`

const Content = styled.article`
  flex: 1;
  box-sizing: border-box;
  min-width: 200px;
  max-width: 675px;
  margin: 30px 0 30px 30px;

  ${media.phablet`
    padding: 15px;
  `};
`

const Sections = styled.div`
  margin-bottom: 40px;
  margin-top: 10px;
  min-width: 280px;
`

const SectionLinks = styled.div`
  @media (max-width: 768px) {
    position: relative;
  }
`

const SectionLink = styled.a`
  display: block;
  position: relative;
  font-size: 18px;
  font-weight: 500;
  color: #b0b8c5;
  text-decoration: none;
  font-weight: 400;
  line-height: 26px;
  min-height: 26px;
  padding-bottom: 5px;
  padding-left: 15px;
  cursor: pointer;
  margin: 0;

  &:hover {
    color: #3c3937;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 8px;
    height: 5px;
    background: url('/static/img/triangle_dark.svg') no-repeat center center;
    left: 0px;
    top: 10px;

    ${props =>
      props.isActive &&
      `
      transform: rotate(-90deg);
    `} 
  }

  ${props =>
    props.level === 1 &&
    `
    margin-left: 15px;
  `} 
  
  ${props =>
    props.level === 2 &&
    `
      margin-left: 40px;
  `};
  
  ${props =>
    props.level === 3 &&
    `
      margin-left: 60px;

      &::before {
        display: none;
      }
  `};

  ${props =>
    props.isActive &&
    `
    color: #40364d;
	`};
`

const Collapse = styled.div`
  height: 0;
  overflow: hidden;
  height: ${({ isOpen, items }) => isOpen ? items * 31 : 0}px;
  transition: height .3s linear;
`