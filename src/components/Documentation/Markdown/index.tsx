import React, { useCallback, useEffect, useRef } from 'react'
import cn from 'classnames'
import { navigate } from '@reach/router'
import rehypeReact from 'rehype-react'
import Collapsible from 'react-collapsible'

import Link from '../../Link'
import Tooltip from './Tooltip'
import Tutorials from '../TutorialsLinks'
import { getPathWithSource } from '../../../utils/shared/sidebar'

import 'github-markdown-css/github-markdown.css'
import sharedStyles from '../styles.module.css'
import styles from './styles.module.css'

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

const Details: React.SFC<{
  children: Array<{ props: { children: Array<string> } } | string>
}> = ({ children }) => {
  const filteredChildren = children.filter(child => child !== '\n')

  if (!filteredChildren.length) return null
  if (typeof filteredChildren[0] === 'string') return null

  const text = filteredChildren[0].props.children[0]

  return (
    <Collapsible trigger={text} transitionTime={200}>
      {filteredChildren.slice(1)}
    </Collapsible>
  )
}

const Abbr: React.SFC<{ children: [string] }> = ({ children }) => {
  return <Tooltip text={children[0]} />
}

const renderAst = new rehypeReact({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createElement: React.createElement as any,
  Fragment: React.Fragment,
  components: { details: Details, abbr: Abbr, a: Link }
}).Compiler

interface IMarkdownProps {
  htmlAst: object
  githubLink: string
  tutorials: { [type: string]: string }
  prev?: string
  next?: string
}

const Markdown: React.SFC<IMarkdownProps> = ({
  htmlAst,
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
      <div className="markdown-body">{renderAst(htmlAst)}</div>
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

export default Markdown
