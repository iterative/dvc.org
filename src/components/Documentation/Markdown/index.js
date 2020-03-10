import React, { useCallback, useEffect, useRef } from 'react'
import rehypeReact from 'rehype-react'
import PropTypes from 'prop-types'
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

const isInsideCodeBlock = elem => {
  for (let el = elem; el && el !== document; el = el.parentNode) {
    if (el.tagName === 'PRE') return true
    if (el.tagName === 'ARTICLE') return false
  }
  return false
}

function Details({ children }) {
  const filteredChildren = children.filter(child => child !== '\n')

  const text = filteredChildren[0].props.children[0]
  return (
    <Collapsible trigger={text} transitionTime={200}>
      {filteredChildren.slice(1)}
    </Collapsible>
  )
}

Details.propTypes = {
  children: PropTypes.node
}

function ABBR({ children }) {
  return <Tooltip text={children[0]} />
}

ABBR.propTypes = {
  children: PropTypes.node
}

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: { details: Details, abbr: ABBR }
}).Compiler

export default function Markdown({
  htmlAst,
  prev,
  next,
  tutorials,
  githubLink
}) {
  const touchstartXRef = useRef(0)
  const touchendXRef = useRef(0)
  const isCodeBlockRef = useRef(false)

  const handleSwipeGesture = useCallback(() => {
    if (isCodeBlockRef.current) return

    if (touchstartXRef.current - touchendXRef.current > 100) {
      navigate(next)
    }

    if (touchendXRef.current - touchstartXRef.current > 100) {
      navigate(prev)
    }
  }, [prev, next])

  const onTouchStart = useCallback(e => {
    isCodeBlockRef.current = isInsideCodeBlock(e.target)
    touchstartXRef.current = event.changedTouches[0].screenX
  }, [])

  const onTouchEnd = useCallback(() => {
    touchendXRef.current = event.changedTouches[0].screenX
    handleSwipeGesture()
  }, [])

  useEffect(() => {
    document.addEventListener('touchstart', onTouchStart, false)
    document.addEventListener('touchend', onTouchEnd, false)

    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

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
      <div className="markdown-body">{renderAst(htmlAst)}</div>
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
          <LocalLink href={next} as={Button}>
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

Markdown.propTypes = {
  htmlAst: PropTypes.object.isRequired,
  githubLink: PropTypes.string.isRequired,
  tutorials: PropTypes.object,
  prev: PropTypes.string,
  next: PropTypes.string
}
