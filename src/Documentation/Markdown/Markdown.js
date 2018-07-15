import React, { Component } from 'react';
// components
import ReactMarkdown from 'react-markdown'
// syntax highlighter
import SyntaxHighlighter, { registerLanguage } from 'react-syntax-highlighter/light'
import docco from 'react-syntax-highlighter/styles/hljs/docco'
import python from 'react-syntax-highlighter/languages/hljs/python'
import yaml from 'react-syntax-highlighter/languages/hljs/yaml'
import usage from './lang/usage'
import dvc from './lang/dvc'
import linker from './utils/remark-linker'
// utils
import kebabCase from 'lodash.kebabcase'
// styles
import styled from 'styled-components'
import { media } from '../../../src/styles'

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

export default class Markdown extends Component {
  
  render() {
    const { markdown, githubLink } = this.props;

    return (
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
    );
  }
} 


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
