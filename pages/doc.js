import React, { Component } from 'react'
import { withRouter } from 'next/router'

import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { style as codeStyle } from 'react-syntax-highlighter/styles/prism'

import { media } from '../src/styles'

import fetch from 'isomorphic-fetch';
import Page from '../src/Page'
import SearchForm from '../src/SearchForm'
import DownloadButton from '../src/DownloadButton'

const Code = ({ source }) => (
  <CodeBlock language="bash" style={codeStyle}>
    {source}
  </CodeBlock>
)

const PartTitle = ({ name, children, small, noline }) => (
  <PartTitleLink id={name} href={`#${name}`} noline={small || noline}>
    <SubHeading small={small}>{children}</SubHeading>
  </PartTitleLink>
)

export default class Documentation extends Component {
  state = {
    doc: ''
  }

  componentWillMount() {
    if (process.browser) {
      fetch('/static/doc/test.md')
        .then(res => {
          res.text().then(r => {
            this.setState({
              doc: r
            })
           })})
    }
  }

  render() {
    const { doc } = this.state

    return (
      <Page stickHeader={true}>
        <Container>
          <Side>
            <Menu>
              <Heading>Documentation</Heading>

              <br/>
              <br/>
              {/* IN DEV */}
              {/*<SearchArea>*/}
              {/*<SearchForm />*/}
              {/*</SearchArea>*/}

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
                  <SectionLink level={2} href={'#tools_existing'}>
                    Existing engineering tools
                  </SectionLink>
                  <SectionLink level={2} href={'#tools_expirimental'}>
                    Experiment management software
                  </SectionLink>
                  <SectionLink level={1} href={'#what_is_dvc'}>
                    What is DVC?
                  </SectionLink>
                  <SectionLink level={1} href={'#core_features'}>
                    Core features
                  </SectionLink>
                  <SectionLink level={1} href={'#related'}>
                    Related technologies
                  </SectionLink>
                  <SectionLink level={1} href={'#how_does_it_work'}>
                    How does it work?
                  </SectionLink>
                  <SectionLink level={1} href={'#installation'}>
                    Installation
                  </SectionLink>
                  <SectionLink level={2} href={'#installation_os_packages'}>
                    OS packages
                  </SectionLink>
                  <SectionLink level={2} href={'#installation_pip'}>
                    Python pip
                  </SectionLink>
                  <SectionLink level={2} href={'#installation_homebrew'}>
                    Homebrew Cask
                  </SectionLink>
                  <SectionLink level={2} href={'#installation_dev'}>
                    Development Version
                  </SectionLink>
                  <SectionLink level={1} href={'#configuration'}>
                    Configuration
                  </SectionLink>
                  <SectionLink level={2} href={'#configuration_structure'}>
                    DVC Files and Directories
                  </SectionLink>
                  <SectionLink level={1} href={'#configuration_cloud'}>
                    Working with Cloud Data Storages
                  </SectionLink>
                  <SectionLink level={1} href={'#commands'}>
                    Using DVC Commands
                  </SectionLink>
                  <SectionLink level={2} href={'#commands_cheat_sheet'}>
                    DVC Commands Cheat Sheet
                  </SectionLink>
                  <SectionLink level={1} href={'#commands_command_reference'}>
                    DVC Command Reference
                  </SectionLink>
                  <SectionLink level={2} href={'#commands_command_reference_init'}>
                    init
                  </SectionLink>
                  <SectionLink level={2} href={'#commands_command_reference_add'}>
                    add
                  </SectionLink>
                  <SectionLink
                    level={2}
                    href={'#commands_command_reference_checkout'}
                  >
                    checkout
                  </SectionLink>
                  <SectionLink level={2} href={'#commands_command_reference_run'}>
                    run
                  </SectionLink>
                  <SectionLink level={2} href={'#commands_command_reference_push'}>
                    push
                  </SectionLink>
                  <SectionLink level={2} href={'#commands_command_reference_pull'}>
                    pull
                  </SectionLink>
                  <SectionLink
                    level={2}
                    href={'#commands_command_reference_status'}
                  >
                    status
                  </SectionLink>
                  <SectionLink level={2} href={'#commands_command_reference_repro'}>
                    repro
                  </SectionLink>
                  <SectionLink
                    level={2}
                    href={'#commands_command_reference_remove'}
                  >
                    remove
                  </SectionLink>
                  <SectionLink level={2} href={'#commands_command_reference_gc'}>
                    gc
                  </SectionLink>
                  <SectionLink
                    level={2}
                    href={'#commands_command_reference_config'}
                  >
                    config
                  </SectionLink>
                  <SectionLink level={2} href={'#commands_command_reference_show'}>
                    show
                  </SectionLink>
                  <SectionLink level={2} href={'#commands_command_reference_fsck'}>
                    fsck
                  </SectionLink>
                  <SectionLink level={1} href={'#common_arguments'}>
                    Common Arguments
                  </SectionLink>
                  <SectionLink level={2} href={'#common_arguments_options'}>
                    Common Options
                  </SectionLink>
                  <SectionLink
                    level={2}
                    href={'#common_arguments_number_of_dvc_jobs'}
                  >
                    Number of DVC Jobs
                  </SectionLink>
                </SectionLinks>
              </Sections>
              {/* /Sections */}

              <OnlyDesktop>
                <DownloadButton/>
              </OnlyDesktop>
            </Menu>
          </Side>
          <Content>
            <ReactMarkdown source={doc} />
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
  padding-top: 32px;
  padding-rigth: 42px;

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

  padding-top: 69px;
  padding-left: 62px;

  ${media.phablet`
    padding: 30px;
  `};
`

const Inner = styled.div`
  max-width: 615px;

  ${media.phablet`
    max-width: auto;
  `} color: #5f6c72;
  font-size: 18px;
  line-height: 1.5;
`

const TutorialLink = styled.a`
  font-size: 18px;
  color: #945dd6;

  padding-right: 26px;
  background: url('/static/img/link.svg') no-repeat center right;

  &:hover,
  &:visited {
    color: #945dd6;
  }
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
    height: 4.7px;
    background: url('/static/img/triangle_dark.svg') no-repeat center center;
    left: 0px;
    top: 10px;
  }

  ${props =>
    props.level === 1 &&
    `
    padding-left: 14px;
  `} ${props =>
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

const Parts = styled.article`
  > ul,
  > ol {
    padding-left: 1em;
  }
`

const SubSectionTitle = styled.h4`
  font-weight: normal;
`

const CodeBlock = styled(SyntaxHighlighter)`
  font-family: monospace, monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #fcf6f0 !important;
  border-radius: 12px;
  padding: 2em 2em;
  background-color: hsla(0, 0%, 0%, 0.04);

  code {
    font-family: Space Mono, SFMono-Regular, Menlo, Monaco, Consolas,
      Liberation Mono, Courier New, monospace;
    padding: 0;
    background: #fcf6f0;
    font-size: 80%;
    font-variant: none;
    -webkit-font-feature-settings: 'clig' 0, 'calt' 0;
    font-feature-settings: 'clig' 0, 'calt' 0;
  }
`

const Definition = styled.b`
  color: #40364d;
  font-weight: bold;
`

const Line = styled.div`
  height: 1px;
  background-color: #f0f0f0;
  margin-top: 20px;
  margin-bottom: 20px;
`

const Paragraph = styled.p`
  margin: 22px 0px;
  font-size: 18px;
  color: #5f6c72;
  line-height: 1.5;

  * {
    color: #5f6c72;
    font-size: 18px;
    line-height: 1.5;
  }

  a {
    color: #1b72df;
  }

  ${props =>
    props.inline &&
    `
    margin: 0px;
  `} ul, ol {
    padding-left: 46px;
    margin: 18px 0px;

    li {
      margin: 1em 0px;
    }

    p {
      margin: 12px 0px;
    }
  }

  ul {
    list-style: disc;
  }
`

const Note = Paragraph.extend`
  color: #333;
`

const PartTitleLink = styled.a`
  padding-top: 18px;
  color: rgb(27, 27, 27);
  text-decoration: none;

  display: block;
  margin-top: 18px;
  margin-bottom: 18px;
  border-top: 1px solid #f0f0f0;

  ${props =>
    props.noline &&
    `
    margin-top: 0px;
    margin-bottom: 0px;
    border-top: none;
  `};
`

const SubHeading = styled.h2`
  font-size: 30px;
  margin-bottom: 5px;
  color: #40364d;

  ${props =>
    props.small &&
    `
    padding-top: 1em;
    padding-bottom: 1em;
    font-size: 20px;
  `};

  a {
    text-decoration: none;
    color: rgb(27, 27, 27);
  }
`

const OnlyDesktop = styled.div`
  display: initial;
  ${media.giant`display: initial;`};
  ${media.desktop`display: initial;`};
  ${media.tablet`display: initial;`};
  ${media.phablet`display: none;`};
  ${media.phone`display: none;`};
`
