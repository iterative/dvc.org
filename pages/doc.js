import React, { Component } from 'react'
// components
import ReactMarkdown from 'react-markdown'
import Page from '../src/Page'
import SearchForm from '../src/SearchForm'
import DownloadButton from '../src/DownloadButton'
// code highlighter
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/light'
import docco from 'react-syntax-highlighter/styles/hljs/docco'
import usage from '../src/Documentation/usage'
import dvc from '../src/Documentation/dvc'
import python from 'react-syntax-highlighter/languages/hljs/python'
import yaml from 'react-syntax-highlighter/languages/hljs/yaml'
import linker from '../src/Documentation/remark-linker'
// utils
import fetch from 'isomorphic-fetch'
import kebabCase from 'lodash.kebabcase'
import startCase from 'lodash.startcase'
import compact from 'lodash.compact'
import { scroller, animateScroll } from 'react-scroll'
// styles
import styled from 'styled-components'
import { media, OnlyDesktop } from '../src/styles'
// documentation
import sidebar from '../src/Documentation/sidebar'

registerLanguage('dvc', dvc)
registerLanguage('python', python)
registerLanguage('usage', usage)
registerLanguage('yaml', yaml)

function flatten(text, child) {
  return typeof child === 'string'
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text)
}

const HeadingRenderer = ({ level, children }) => {
  const content = React.Children.toArray(children)
  const text = children.reduce(flatten, '')
  const slug = kebabCase(text)
  return React.createElement('h' + level, { id: slug }, content)
}

const CodeBlock = ({ value, language }) => {
  const dvcStyle = Object.assign({}, docco)
  dvcStyle["hljs-comment"] = {"color": "#999"}
  dvcStyle["hljs-meta"] = {"color": "#333", "fontSize": "14px"}
  return <SyntaxHighlighter
    language={language}
    style={dvcStyle}
  >
    {value}
  </SyntaxHighlighter>  
}

export default class Documentation extends Component {
  state = {
    currentSection: 0,
    currentFile: null,
    markdown: '',
    headings: [],
  }

  componentDidMount() {
    this.loadStateFromURL()
  }

  loadStateFromURL = () => {
    const { pathname } =  window.location

    // match section from URL
    const sectionURL = pathname.split('/')[2]
    const sectionIndex = sidebar.findIndex((section) => 
      (section.slug || kebabCase(section.name)) === sectionURL
    )
    
    if (sectionIndex === -1) {
      this.onSectionSelect(0)
    } else {
      // match file from URL
      const fileURL = pathname.split('/')[3]
      const fileIndex = sidebar[sectionIndex].files.findIndex((file) => 
        kebabCase(file.slice(0, -3)) === fileURL
      )

      if (fileIndex === -1) {
        this.onSectionSelect(sectionIndex)
      } else {
        this.loadFile({
          section: sectionIndex, 
          file: sidebar[sectionIndex].files[fileIndex], 
          parseHeadings: true
        })
      }
    }
  }

  getLinkHref = (section, file) => {
    const sectionSlug = sidebar[section].slug || kebabCase(sidebar[section].name)
    const fileSlug = file ? kebabCase(file.slice(0, -3)) : undefined
    return `/doc/${compact([sectionSlug, fileSlug]).join('/')}`;
  }

  setCurrentPath = ({ section, file }) => {
    const sectionSlug = sidebar[section].slug || kebabCase(sidebar[section].name)
    const fileSlug = file ? kebabCase(file.slice(0, -3)) : undefined
    window.history.pushState(null, null, `/doc/${compact([sectionSlug, fileSlug]).join('/')}`)
  }

  onSectionSelect = (section, e) => {
    e && e.preventDefault();
    const { indexFile, files } = sidebar[section]
    const file = indexFile || files[0]
    this.setCurrentPath({ section })
    this.loadFile({ file, section, parseHeadings: false })
    this.setState({
      currentSection: section,
    })
  }

  onFileSelect = (file, section, e) => {
    e && e.preventDefault();
    this.setCurrentPath({ section, file })
    this.loadFile({ file, section, parseHeadings: true })
  }

  loadFile = ({ file, section, parseHeadings }) => {
    fetch(`${sidebar[section].folder}/${file}`).then(res => {
      res.text().then(text => {
        this.setState({
          currentSection: section,
          currentFile: file,
          markdown: text,
          headings: [],
        }, () => {
          this.scrollTop();
          parseHeadings && this.parseHeadings(text);
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

    this.setState({ headings: matches }, this.autoScroll)
  }

  autoScroll = () => {
    const { hash } =  window.location
    if (hash) this.scrollToLink(hash)
  }

  scrollToLink = (href) => {
    scroller.scrollTo(href.slice(1), {
      duration: 600,
      offset: -85,
      delay: 0,
      smooth: 'ease',
    })
  }

  scrollTop = () => {
    animateScroll.scrollTo(0, {
      duration: 300,
      offset: -85,
      delay: 0,
      smooth: 'ease',
    })
  }

  render() {
    const { currentSection, currentFile, markdown, headings } = this.state
    const githubLink = `https://github.com/iterative/dvc.org/blob/master${sidebar[currentSection].folder}/${currentFile}`

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
                    sidebar.map(({ name, files = [], labels = {} }, index) => {
                      const isSectionActive = currentSection === index;
                      return (
                        <div key={index}>
                          <SectionLink
                            level={1} 
                            href={this.getLinkHref(index)}
                            onClick={(e) => this.onSectionSelect(index, e)} 
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
                                    href={this.getLinkHref(index, file)}
                                    onClick={(e) => this.onFileSelect(file, index, e)}
                                    isActive={isFileActive}
                                  >
                                    {labels[file] || startCase(file.slice(0, -3))}
                                  </SectionLink>

                                  {/* File Headings */}
                                  <Collapse isOpen={isFileActive} items={headings.length}>
                                    {!!headings.length && headings.map(({ text, slug }, headingIndex) => (
                                      <SectionLink 
                                        level={3}
                                        key={`link-${headingIndex}`}
                                        onClick={() => this.scrollToLink('#' + slug)}
                                        href={`#${slug}`}
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
            <GithubLink href={githubLink} target="_blank">
              <i/> Edit on Github
            </GithubLink>
            <ReactMarkdown 
              className="markdown-body"
              source={markdown}
              renderers={{
                code: CodeBlock,
                heading: HeadingRenderer,
              }}
              astPlugins={[linker()]}
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
  flex-basis: 33.7%;
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
  margin-left: 10px;

  ${media.phablet`
    padding-top: 30px;
    padding-right: 30px;
    padding-bottom: 30px;
    width: 100%;
    max-width: none;
    margin-right: 0px;
    margin-left: 20px;
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
  max-width: 670px;
  margin: 30px 15px 30px 30px;
  position: relative;

  ${media.phablet`
    padding-top: 20px;
    margin: 20px;
  `};

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }
  
  em {
    font-style: italic;
  }

  .markdown-body {
    font-family: inherit;
    font-size: 18px;
  }
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
    margin-left: 5px;
  `} 
  
  ${props =>
    props.level === 2 &&
    `
      margin-left: 30px;
  `};
  
  ${props =>
    props.level === 3 &&
    `
      margin-left: 50px;

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

const GithubLink = styled.a`
  float: right;
  margin: 5px 0 10px 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  color: #242A31 !important;
  background-color: #FFFFFF;
  border: 1px solid #D3DCE4;
  
  line-height: 30px;
  padding: 2px 16px;
  border-radius: 3px;
  cursor: pointer;
  transition: 0.2s background-color ease-out;

  ${media.tablet`
    float: none;
    margin: 0 0 15px 0;
  `};

  &:hover {
    background-color: #F5F7F9;
  }

  i {
    background-image: url(/static/img/github_icon.svg);
    background-size: contain;
    width: 1em;
    height: 1em;
    margin-right: 7px;
  }
`
