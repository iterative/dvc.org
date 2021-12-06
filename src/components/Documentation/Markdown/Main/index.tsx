import React, { useEffect, useRef, useCallback } from 'react'
import cn from 'classnames'
import { navigate } from '@reach/router'

import Link from '../../../Link'
import Tutorials from '../../TutorialsLinks'
import { getPathWithSource } from '../../../../utils/shared/sidebar'

import 'github-markdown-css/github-markdown-light.css'
import * as sharedStyles from '../../styles.module.css'
import * as styles from './styles.module.css'

const isInsideCodeBlock = (node: Element): boolean => {
  while (node?.parentNode) {
    if (node.tagName === 'PRE') {
      return true
    }

    if (node.tagName === 'ARTICLE') {
      return false
    }

    node = node.parentNode as Element
  }

  return false
}

interface IMainProps {
  githubLink: string
  tutorials: { [type: string]: string }
  prev?: string
  next?: string
}

const Main: React.FC<IMainProps> = ({
  children,
  prev,
  next,
  tutorials,
  githubLink
}) => {
  const touchstartXRef = useRef(0)
  const touchendXRef = useRef(0)
  const isCodeBlockRef = useRef(false)
  const handleSwipeGesture = useCallback(() => {
    if (isCodeBlockRef.current) return

    if (next && touchstartXRef.current - touchendXRef.current > 100) {
      navigate(next)
    }

    if (prev && touchendXRef.current - touchstartXRef.current > 100) {
      navigate(prev)
    }
  }, [prev, next])
  const onTouchStart = useCallback(e => {
    isCodeBlockRef.current = isInsideCodeBlock(e.target)
    touchstartXRef.current = e.changedTouches[0].screenX
  }, [])
  const onTouchEnd = useCallback(e => {
    touchendXRef.current = e.changedTouches[0].screenX
    handleSwipeGesture()
  }, [])

  useEffect(() => {
    document.addEventListener('touchstart', onTouchStart, false)
    document.addEventListener('touchend', onTouchEnd, false)

    return (): void => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return (
    <div className={styles.content} id="markdown-root">
      {tutorials && (
        <div className={styles.tutorialsWrapper}>
          <Tutorials tutorials={tutorials} compact={true} />
        </div>
      )}
      <Link
        className={cn(sharedStyles.button, styles.githubLink)}
        href={githubLink}
        target="_blank"
      >
        <i className={cn(sharedStyles.buttonIcon, styles.githubIcon)} /> Edit on
        GitHub
      </Link>
      <div className="markdown-body">{children}</div>
      <div className={styles.navButtons}>
        <Link className={styles.navButton} href={prev || '#'}>
          <i className={cn(styles.navButtonIcon, styles.prev)} />
          <span>Prev</span>
        </Link>
        <Link
          className={styles.navButton}
          href={next ? getPathWithSource(next) : '#'}
        >
          <span>Next</span>
          <i className={cn(styles.navButtonIcon, styles.next)} />
        </Link>
      </div>
    </div>
  )
}

export default Main
