import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import 'github-markdown-css/github-markdown.css'

import { navigate } from '@reach/router'

import LocalLink from '../../LocalLink'

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

export default function Markdown({ html, prev, next, tutorials, githubLink }) {
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
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: html }}
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

Markdown.propTypes = {
  html: PropTypes.string.isRequired,
  githubLink: PropTypes.string.isRequired,
  tutorials: PropTypes.object,
  prev: PropTypes.string,
  next: PropTypes.string
}
