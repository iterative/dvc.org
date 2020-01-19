import React from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import Router from 'next/router'
// components
import ReactMarkdown from 'react-markdown'
import { LightButton } from '../LightButton'
import Tutorials from '../Tutorials'
import Tooltip from '../../Tooltip'
import Collapsible from 'react-collapsible'
// syntax highlighter
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import python from 'react-syntax-highlighter/dist/cjs/languages/hljs/python'
import yaml from 'react-syntax-highlighter/dist/cjs/languages/hljs/yaml'
import ini from 'react-syntax-highlighter/dist/cjs/languages/hljs/ini'
import bash from 'react-syntax-highlighter/dist/cjs/languages/hljs/bash'
import diff from 'react-syntax-highlighter/dist/cjs/languages/hljs/diff'
import vim from 'react-syntax-highlighter/dist/cjs/languages/hljs/vim'
import usage from './lang/usage'
import dvc from './lang/dvc'
import linker from './utils/remark-linker'
// consts
import { PAGE_DOC } from '../../consts'
// utils
import kebabCase from 'lodash.kebabcase'
// styles
import styled from 'styled-components'
import { media } from '../../../src/styles'

SyntaxHighlighter.registerLanguage('dvc', dvc)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('usage', usage)
SyntaxHighlighter.registerLanguage('yaml', yaml)
SyntaxHighlighter.registerLanguage('ini', ini)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('vim', vim)
SyntaxHighlighter.registerLanguage('diff', diff)

function flatten(text, child) {
  return typeof child === 'string'
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text)
}

const HeadingRenderer = ({ level, children }) => {
  const content = React.Children.toArray(children)
  const text = children.reduce(flatten, '')
  const slug = kebabCase(text)
  const anchor =
    level !== 1 ? (
      <a className="anchor" aria-hidden="true" href={`#${slug}`}>
        <svg
          className="octicon octicon-link"
          viewBox="0 0 16 16"
          version="1.1"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            // eslint-disable-next-line max-len
            d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
          ></path>
        </svg>
      </a>
    ) : null
  return React.createElement('h' + level, { id: slug }, anchor, content)
}

HeadingRenderer.propTypes = {
  level: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
}

const HtmlRenderer = props => {
  if (props.tag !== 'details' && props.tag !== 'abbr') {
    return React.createElement(props.tag, {}, props.children)
  } else if (props.tag === 'details') {
    const text = props.children[0].props.children[0]
    return (
      <Collapsible trigger={text} transitionTime={200}>
        {props.children.slice(1)}
      </Collapsible>
    )
  } else if (props.tag === 'abbr') {
    const text = props.children[0]
    const key = props.children[0].key
    return <Tooltip id={key} text={text} />
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

CodeBlock.propTypes = {
  language: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired
}

const Link = ({ children, href, ...props }) => {
  const externalLink = href.match(/^(\/\/|http(s)?:\/\/)/)
  const showIcon =
    externalLink && children && typeof children[0].props.children === 'string'

  const modifiedProps = externalLink
    ? { ...props, target: '_blank', rel: 'noopener nofollow' }
    : props

  if (showIcon) {
    return (
      <ExternalLink href={href} {...modifiedProps}>
        {children}
      </ExternalLink>
    )
  }

  const nextProps = href.match(/^\/doc/)
    ? { href: PAGE_DOC, as: href }
    : { href }

  return (
    <NextLink {...nextProps}>
      <a {...modifiedProps}>{children}</a>
    </NextLink>
  )
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired
}

export default class Markdown extends React.PureComponent {
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
    for (let el = elem; el && el !== document; el = el.parentNode) {
      if (el.tagName === 'PRE') return true
      if (el.tagName === 'ARTICLE') return false
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
    const { prev, next } = this.props

    if (this.touchstartX - this.touchendX > 100) {
      Router.push({ asPath: PAGE_DOC, pathname: next })
    }

    if (this.touchendX - this.touchstartX > 100) {
      Router.push({ asPath: PAGE_DOC, pathname: prev })
    }
  }

  render() {
    const { markdown, githubLink, prev, next, tutorials } = this.props

    return (
      <Content id="markdown-root">
        {tutorials && (
          <TutorialsWrapper>
            <Tutorials tutorials={tutorials} compact={true} />
          </TutorialsWrapper>
        )}
        <GithubLink href={githubLink} target="_blank" rel="nofollow noopener">
          <i /> Edit on GitHub
        </GithubLink>
        <ReactMarkdown
          key={githubLink}
          className="markdown-body"
          escapeHtml={false}
          source={markdown}
          renderers={{
            link: Link,
            code: CodeBlock,
            heading: HeadingRenderer,
            virtualHtml: HtmlRenderer
          }}
          astPlugins={[linker()]}
        />
        <NavigationButtons>
          <NextLink href={PAGE_DOC} as={prev} passHref>
            <Button disabled={!prev}>
              <i className="prev" />
              <span>Prev</span>
            </Button>
          </NextLink>
          <NextLink href={PAGE_DOC} as={next} passHref>
            <Button disabled={!next}>
              <span>Next</span>
              <i className="next" />
            </Button>
          </NextLink>
        </NavigationButtons>
      </Content>
    )
  }
}

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
  githubLink: PropTypes.string.isRequired,
  tutorials: PropTypes.object,
  prev: PropTypes.string,
  next: PropTypes.string
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
    cursor: pointer;

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

const Button = styled.a`
  text-decoration: none;
  background: white;
  padding: 10px 15px;
  text-transform: uppercase;
  color: #333;
  border-bottom: 3px solid #13adc7;
  display: inline-flex;
  align-items: center;
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

const TutorialsWrapper = styled.div`
  position: relative;
  z-index: 1;
  float: right;
  margin: 5px 0 0 10px;

  ${media.tablet`
    margin: 0 0 15px 0;
  `}

  @media only screen and (min-width: 1200px) {
    display: none;
  }
`

export const GithubLink = styled(LightButton)`
  display: none;
  float: right;
  margin: 5px 0 10px 10px;
  z-index: 1;
  position: relative;

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

const ExternalLink = styled.a`
  &:after {
    position: relative;
    top: 1px;
    right: 0;
    width: 12px;
    height: 12px;
    margin-left: 1px;
    /* Icon source https://en.wikipedia.org/w/skins/Vector/images/external-link-ltr-icon.svg */
    content: url(/static/img/external-link.svg);
  }
`
