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

const HeadingRenderer = (props) => {
  var children = React.Children.toArray(props.children)
  var text = children.reduce(flatten, '')
  var slug = kebabCase(text)
  return React.createElement('h' + props.level, { id: slug }, props.children)
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
    activeSection: 0,
    markdown: '',
  }

  componentDidMount() {
    this.loadFile(sidebar[0].file)
  }

  selectSection = (index) => () => {
    this.loadFile(sidebar[index].file)
    this.setState({
      activeSection: index
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

  loadFile = (file) => {
    fetch(file)
      .then(res => {
        res.text().then(r => {
          this.setState({ markdown: r })
          this.scrollTop()
        })
      })
  }

  render() {
    const { activeSection, markdown } = this.state

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
                    sidebar.map(({ name, links = [] }, index) => {
                      const isActive = activeSection === index;
                      return (
                        <div key={index}>
                          <SectionLink level={1} onClick={this.selectSection(index)} isActive={isActive}>
                            {name}
                          </SectionLink>
                          <Collapse items={links.length} isOpen={isActive}>
                            {links && links.map((link, idx) => (
                              <SectionLink level={2} onClick={this.scrollToLink(link.href)} key={idx}>
                                {link.name}
                              </SectionLink>
                            ))}
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
  margin-bottom: 5px;
  cursor: pointer;

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
  }

  ${props =>
    props.level === 1 &&
    `
    padding-left: 14px;
  `} 
  
  ${props =>
    props.level === 2 &&
    `
      padding-left: 44px;

      &::before {
        display: none;
      }
  `};

  ${props =>
    props.isActive &&
    `
    color: #333;
	`};
`

const Collapse = styled.div`
  height: ${({ items, isOpen }) => isOpen ? items * 30 + 5*(!!items) : 0}px
  overflow: hidden;
  transition: height .3s ease;
`
