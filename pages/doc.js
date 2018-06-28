import React, { Component } from 'react'
// components
import ReactMarkdown from 'react-markdown'
import Page from '../src/Page'
import SearchForm from '../src/SearchForm'
import DownloadButton from '../src/DownloadButton'
// syntax highlight
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/light'
import docco from 'react-syntax-highlighter/styles/hljs/docco'
import js from 'react-syntax-highlighter/languages/hljs/javascript'
import python from 'react-syntax-highlighter/languages/hljs/python'
import bash from 'react-syntax-highlighter/languages/hljs/bash'
// utils
import fetch from 'isomorphic-fetch'
// styles
import styled from 'styled-components'
import { media, OnlyDesktop } from '../src/styles'

registerLanguage('js', js)
registerLanguage('python', python)
registerLanguage('sh', bash)

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
    markdown: ''
  }

  componentWillMount() {
    if (process.browser) {
      // fetch('/static/doc/markdown-test.md')
      fetch('/static/docs/redux-saga.md')
        .then(res => {
          res.text().then(r => {
            this.setState({ markdown: r })
           })
        })
    }
  }

  render() {
    const { markdown } = this.state

    return (
      <Page stickHeader={true}>
        <Container>
          <Side>
            <Menu>
              <Heading>Documentation</Heading>

              {/* Search */}
              <SearchArea>
                <SearchForm />
              </SearchArea>

              {/* Sections */}
              <Sections>
                <SectionLinks>
                  <SectionLink level={1} href={'#tutorial'}>
                    Tutorial
                  </SectionLink>
                  <SectionLink level={1} href={'#collaboration'}>
                    Collaboration issues in data science
                  </SectionLink>
                  <SectionLink level={1} href={'#tools'}>
                    Tools for data scientists
                  </SectionLink>
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
                code: CodeBlock
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
  max-width: 1005px;
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

const Heading = styled.h3`
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
  max-width: 980px;
  margin: 30px 0 30px 30px;

  ${media.phablet`
    padding: 15px;
  `};
`

const Sections = styled.div`
  margin-bottom: 40px;
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

  line-height: 26px;
  min-height: 26px;
  margin-bottom: 5px;

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
    props.underlined &&
    `
	  font-weight: bold;
	`};
`
