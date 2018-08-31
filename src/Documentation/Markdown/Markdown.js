import React, { Component } from 'react';
// components
import ReactMarkdown from 'react-markdown'
// syntax highlighter
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/light'
import Collapsible from 'react-collapsible'
import docco from 'react-syntax-highlighter/styles/hljs/docco'
import python from 'react-syntax-highlighter/languages/hljs/python'
import yaml from 'react-syntax-highlighter/languages/hljs/yaml'
import ini from 'react-syntax-highlighter/languages/hljs/ini'
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

const HtmlRenderer = (props) => {
  if (props.tag !== 'details') {
    return React.createElement(props.tag, {}, props.children)
  } else {
    const text = props.children[0].props.children[0]
    return <Collapsible trigger={text} transitionTime={200}>
      {props.children.slice(1)}
    </Collapsible>
  }
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

export default class Markdown extends Component {

  constructor() {
    super();
    this.touchstartX = 0;
    this.touchendX = 0;
    this.isCodeBlock = false;
  }

  componentDidMount() {
    document.addEventListener('touchstart', this.onTouchStart, false);
    document.addEventListener('touchend', this.onTouchEnd, false); 
  }

  componentWillUnmount() {
    document.removeEventListener('touchstart', this.onTouchStart);
    document.removeEventListener('touchend', this.onTouchEnd); 
  }

  isInsideCodeBlock = (elem) => {
    for ( ;elem && elem !== document; elem = elem.parentNode) {
      if (elem.tagName === 'PRE') return true;
      if (elem.tagName === 'ARTICLE') return false;
    }
    return false;
  };

  onTouchStart = (e) => {
    this.isCodeBlock = this.isInsideCodeBlock(e.target);
    this.touchstartX = event.changedTouches[0].screenX;
  }

  onTouchEnd = () => {
    this.touchendX = event.changedTouches[0].screenX;
    this.handleSwipeGesture();
  }

  handleSwipeGesture = () => {
    if (this.isCodeBlock) return;
    const {  section, file, onFileSelect } = this.props;
    const files = sidebar[section].files;
    const fileIndex = files.findIndex((f) => f === file);
    const showPrev = fileIndex > 0;
    const showNext = fileIndex + 1 < sidebar[section].files.length;

    if (this.touchstartX - this.touchendX > 100) {
      showNext && onFileSelect(files[fileIndex + 1], section)
    }

    if (this.touchendX - this.touchstartX > 100) {
      showPrev && onFileSelect(files[fileIndex - 1], section);
    }
  }

  render() {
    const { markdown, githubLink, section, file, onFileSelect } = this.props;
    const files = sidebar[section].files;
    const fileIndex = files.findIndex((f) => f === file);
    const showPrev = fileIndex > 0;
    const showNext = fileIndex + 1 < sidebar[section].files.length;

    return (
      <Content>
        <GithubLink href={githubLink} target="_blank">
          <i/> Edit on Github
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
          <Button onClick={() => onFileSelect(files[fileIndex - 1], section)} disabled={!showPrev}>
            <i className="prev" />
            <span>Prev</span>
          </Button>
          <Button onClick={() => onFileSelect(files[fileIndex + 1], section)} disabled={!showNext}>
            <span>Next</span>
            <i className="next" />
          </Button>
        </NavigationButtons>
      </Content>
    );
  }
} 


const Content = styled.article`
  flex: 1;
  box-sizing: border-box;
  min-width: 200px;
  margin: 30px 0 30px 30px;
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
    animation-duration: 1s;
    animation-fill-mode: both;
    animation-name: fadeIn;
  }
  
  .Collapsible {
    margin-bottom: 10px;
  }
  
  .Collapsible__trigger {
    font-family: BrandonGrotesqueMed;
    
     &:before {
      display: inline-block;
      content: "\\00FE0E\\0025B6";
      font-family: monospace;
      color: #F26840;
      margin-right: 10px;
      vertical-align: center;
      font-size: 14px;
      transition: transform 200ms;
    }
    
    &.is-open {
      &:before {
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
        font-size: 14px;
        font-family: monospace;
      }
    }
  }
  
  .Collapsible__contentInner {
    background-color: rgba(36, 173, 197, 0.05);
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
    color: #454E53;
    margin-left: 20px;
    margin-right: 10px;
  }
  
  details pre {
    font-size: 14px;
    color: #454E53;
    margin-left: 20px;
    margin-right: 10px;
  }
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
  position: relative
  z-index: 1

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
    border-bottom: 3px solid #11849B;
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
    transition: all .3s;

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
