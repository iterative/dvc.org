import React from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import Collapsible from 'react-collapsible'

import 'github-markdown-css/github-markdown.css'

import { navigate } from '@reach/router'

import LocalLink from '../../LocalLink'
import Tooltip from '../../Tooltip'

import Tutorials from '../Tutorials'

import {
  Button,
  Content,
  GithubLink,
  NavigationButtons,
  TutorialsWrapper
} from './styles'

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
      navigate(next)
    }

    if (this.touchendX - this.touchstartX > 100) {
      navigate(prev)
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
            virtualHtml: HtmlRenderer
          }}
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
