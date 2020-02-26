import React from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import Collapsible from 'react-collapsible'
import kebabCase from 'lodash.kebabcase'

import 'github-markdown-css/github-markdown.css'

import Router from 'next/router'

import LocalLink from '../../LocalLink'
import Tooltip from '../../Tooltip'

import Tutorials from '../Tutorials'

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

import { PAGE_DOC } from '../../../consts'

import {
  Button,
  Content,
  ExternalLink,
  GithubLink,
  NavigationButtons,
  TutorialsWrapper
} from './styles'

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

const SLUG_REGEXP = /\s+{#([a-z0-9-]*[a-z0-9]+)}\s*$/

function isTitleHasSlug(title) {
  return typeof title === 'string' && SLUG_REGEXP.test(title)
}

export function extractSlugFromTitle(title) {
  // extracts expressions like {#too-many-files} from the end of a title
  const meta = title.match(SLUG_REGEXP)

  if (meta) {
    return [title.substring(0, meta.index), meta[1]]
  }
  return [title, kebabCase(title)]
}

const HeadingRenderer = ({ level, children }) => {
  const content = React.Children.toArray(children)
  const text = children.reduce(flatten, '')
  let slug = kebabCase(text)

  const lastElement = content[content.length - 1].props.children
  if (isTitleHasSlug(lastElement)) {
    const [newValue, newSlug] = extractSlugFromTitle(lastElement)
    content.push(React.cloneElement(content.pop(), [], newValue))
    slug = newSlug
  }

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
    ? { ...props, target: '_blank', rel: 'noreferrer noopener' }
    : props

  if (showIcon) {
    return (
      <ExternalLink href={href} {...modifiedProps}>
        {children}
      </ExternalLink>
    )
  }

  return (
    <LocalLink href={href} {...modifiedProps}>
      {children}
    </LocalLink>
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
        <GithubLink href={githubLink} target="_blank" rel="noreferrer noopener">
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
          {prev ? (
            <LocalLink href={prev} as={Button}>
              <i className="prev" />
              <span>Prev</span>
            </LocalLink>
          ) : (
            <Button disabled={true}>
              <i className="prev" />
              <span>Prev</span>
            </Button>
          )}
          {next ? (
            <LocalLink href={next} as={Button} disabled={!next}>
              <span>Next</span>
              <i className="next" />
            </LocalLink>
          ) : (
            <Button disabled={true}>
              <span>Next</span>
              <i className="next" />
            </Button>
          )}
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
