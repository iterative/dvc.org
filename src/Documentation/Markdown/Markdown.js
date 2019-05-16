import React, { Component } from 'react'
// components
import ReactMarkdown from 'react-markdown'
import { LightButton } from '../LightButton'
// syntax highlighter
import SyntaxHighlighter, {
  registerLanguage
} from 'react-syntax-highlighter/dist/light'
import Collapsible from 'react-collapsible'
import docco from 'react-syntax-highlighter/dist/styles/hljs/docco'
import python from 'react-syntax-highlighter/dist/languages/hljs/python'
import yaml from 'react-syntax-highlighter/dist/languages/hljs/yaml'
import ini from 'react-syntax-highlighter/dist/languages/hljs/ini'
import bash from 'react-syntax-highlighter/dist/languages/hljs/bash'
import diff from 'react-syntax-highlighter/dist/languages/hljs/diff'
import vim from 'react-syntax-highlighter/dist/languages/hljs/vim'
import usage from './lang/usage'
import dvc from './lang/dvc'
import linker from './utils/remark-linker'
// utils
import kebabCase from 'lodash.kebabcase'
// styles
import styled from 'styled-components'
import { media } from '../../../src/styles'
// json
import sidebar from '../../../src/Documentation/sidebar'

registerLanguage('dvc', dvc)
registerLanguage('python', python)
registerLanguage('usage', usage)
registerLanguage('yaml', yaml)
registerLanguage('ini', ini)
registerLanguage('bash', bash)
registerLanguage('vim', vim)
registerLanguage('diff', diff)

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

const HtmlRenderer = props => {
  if (props.tag !== 'details') {
    return React.createElement(props.tag, {}, props.children)
  } else {
    const text = props.children[0].props.children[0]
    return (
      <Collapsible trigger={text} transitionTime={200}>
        {props.children.slice(1)}
      </Collapsible>
    )
  }
}

const CodeBlock = ({ value, language }) => {
  const dvcStyle = Object.assign({}, docco)
  dvcStyle['hljs-comment'] = { color: '#999' }
  dvcStyle['hljs-meta'] = { color: '#333', fontSize: '14px' }
  dvcStyle['hljs']['padding'] = '0.5em 0.5em 0.5em 2em'
  dvcStyle['hljs-skipped'] = { userSelect: 'none' }
  return (
    <SyntaxHighlighter language={language} style={dvcStyle}>
      {value}
    </SyntaxHighlighter>
  )
}

export default class Markdown extends Component {
  constructor() {
    super()
    this.touchstartX = 0
    this.touchendX = 0
    this.isCodeBlock = false
  }

  componentDidMount() {
    document.addEventListener('touchstart', this.onTouchStart, false)
    document.addEventListener('touchend', this.onTouchEnd, false)
  }

  componentWillUnmount() {
    document.removeEventListener('touchstart', this.onTouchStart)
    document.removeEventListener('touchend', this.onTouchEnd)
  }

  isInsideCodeBlock = elem => {
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.tagName === 'PRE') return true
      if (elem.tagName === 'ARTICLE') return false
    }
    return false
  }

  onTouchStart = e => {
    this.isCodeBlock = this.isInsideCodeBlock(e.target)
    this.touchstartX = event.changedTouches[0].screenX
  }

  onTouchEnd = () => {
    this.touchendX = event.changedTouches[0].screenX
    this.handleSwipeGesture()
  }

  handleSwipeGesture = () => {
    if (this.isCodeBlock) return
    const { section, file, onFileSelect } = this.props
    const files = sidebar[section].files
    const fileIndex = files.findIndex(f => f === file)
    const showPrev = fileIndex > 0
    const showNext = fileIndex + 1 < sidebar[section].files.length

    if (this.touchstartX - this.touchendX > 100) {
      showNext && onFileSelect(files[fileIndex + 1], section)
    }

    if (this.touchendX - this.touchstartX > 100) {
      showPrev && onFileSelect(files[fileIndex - 1], section)
    }
  }

  render() {
    const { markdown, githubLink, section, file, onFileSelect } = this.props
    const files = sidebar[section].files
    const fileIndex = files.findIndex(f => f === file)
    const showPrev = fileIndex > 0
    const showNext = fileIndex + 1 < sidebar[section].files.length

    return (
      <Content>
        <GithubLink href={githubLink} target="_blank">
          <i /> Edit on Github
        </GithubLink>
        <ReactMarkdown
          key={`${section}-${fileIndex}`}
          className="markdown-body"
          escapeHtml={false}
          source={markdown}
          renderers={{
            code: CodeBlock,
            heading: HeadingRenderer,
            virtualHtml: HtmlRenderer
          }}
          astPlugins={[linker()]}
        />
        <NavigationButtons>
          <Button
            onClick={() => onFileSelect(files[fileIndex - 1], section)}
            disabled={!showPrev}
          >
            <i className="prev" />
            <span>Prev</span>
          </Button>
          <Button
            onClick={() => onFileSelect(files[fileIndex + 1], section)}
            disabled={!showNext}
          >
            <span>Next</span>
            <i className="next" />
          </Button>
        </NavigationButtons>
      </Content>
    )
  }
}

const Content = styled.article`
  min-width: 200px;
  margin: 30px;
  flex: 1;

  ${media.phablet`
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
    animation-duration: 1s;
    animation-fill-mode: both;
    animation-name: fadeIn;
  }

  .Collapsible {
    margin-bottom: 10px;
    background-color: rgba(36, 173, 197, 0.2);
    border-radius: 15px;
    -moz-border-radius: 15px;
    padding: 10px;
  }

  .Collapsible__trigger {
    font-family: BrandonGrotesqueMed;
    display: block;
    position: relative;
    opacity: 0.9;

    &:after {
      position: absolute;
      display: inline-block;
      background-size: 20px 20px;
      right: 0;
      width: 20px;
      height: 20px;
      background-image: url('/static/img/click.png');
      content: '';
      font-family: monospace;
      transition: transform 200ms;
    }

    &.is-open {
      &:after {
        opacity: 0.5;
      }
    }
  }

  .Collapsible__contentInner {
    background-color: rgba(36, 173, 197, 0);
    border-radius: 15px;
    -moz-border-radius: 15px;
    padding: 10px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  details p {
    font-size: 17px;
    color: #454e53;
    margin-left: 20px;
    margin-right: 10px;
  }

  details pre {
    font-size: 14px;
    color: #454e53;
    margin-left: 20px;
    margin-right: 10px;
  }
`

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  font-weight: 600;
  font-size: 14px;
`

const Button = styled.div`
  border: none;
  background: white;
  padding: 10px 15px;
  text-transform: uppercase;
  color: #333;
  border-bottom: 3px solid #13adc7;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: 0.2s border-color ease-out;

  &:hover {
    border-bottom: 3px solid #11849b;
  }

  i {
    display: inline-block;
    background-image: url(/static/img/arrow.svg);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    width: 1em;
    height: 1em;
    line-height: 1;
    transition: all 0.3s;

    &.next {
      margin-left: 7px;
    }

    &.prev {
      margin-right: 7px;
      mask-position: center;
      transform: rotate(180deg);
      margin-top: 2px;
    }
  }

  &[disabled] {
    pointer-events: none;
    opacity: 0.5;
  }
`

export const GithubLink = styled(LightButton)`
  display: none;
  float: right;
  margin: 5px 0 10px 10px;
  z-index: 1;
  position relative;
  
  ${media.tablet`
    float: none;
    margin: 0 0 15px 0;
  `};

  @media only screen and (max-width: 1200px) {
    display: inline-flex;
  }

  i {
    background-image: url(/static/img/github_icon.svg);
  }
`
