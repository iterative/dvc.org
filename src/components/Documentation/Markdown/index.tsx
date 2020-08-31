import React, {
  useCallback,
  useEffect,
  useRef,
  ReactNode,
  ReactElement
} from 'react'
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

const Details: React.FC<{
  children: Array<{ props: { children: ReactNode } } | string>
}> = ({ children }) => {
  const filteredChildren: ReactNode[] = children.filter(child => child !== '\n')
  const firstChild = filteredChildren[0] as JSX.Element

  if (!/^h.$/.test(firstChild.type)) {
    throw new Error('The first child of a details element must be a heading!')
  }

  /*
     To work around auto-linked headings, the last child of the heading node
     must be removed. The only way around this is the change the autolinker,
     which we currently have as an external package.
   */
  const triggerChildren: ReactNode[] = firstChild.props.children.slice(
    0,
    firstChild.props.children.length - 1
  ) as ReactNode[]

  /*
     Collapsible's trigger type wants ReactElement, so we force a TS cast from
     ReactNode here.
   */
  return (
    <Collapsible
      trigger={(triggerChildren as unknown) as ReactElement}
      transitionTime={200}
    >
      {filteredChildren.slice(1)}
    </Collapsible>
  )
}

const Abbr: React.FC<{ children: [string] }> = ({ children }) => {
  return <Tooltip text={children[0]} />
}

const Cards: React.FC = ({ children }) => {
  return <div className={styles.cards}>{children}</div>
}

const InnerCard: React.FC<{
  href?: string
  className?: string
}> = ({ href, children, className }) =>
  href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  )

const Card: React.FC<{
  icon?: string
  heading?: string
  href?: string
  headingtag:
    | string
    | React.FC<{
        className: string
      }>
}> = ({ children, icon, heading, headingtag: Heading = 'h3', href }) => {
  let iconElement

  if (Array.isArray(children) && icon) {
    const firstRealItemIndex = children.findIndex(x => x !== '\n')
    iconElement = children[firstRealItemIndex]
    children = children.slice(firstRealItemIndex + 1)
  }

  return (
    <div className={styles.cardWrapper}>
      <InnerCard href={href} className={styles.card}>
        {iconElement && <div className={styles.cardIcon}>{iconElement}</div>}
        <div className={styles.cardContent}>
          {heading && (
            <Heading className={styles.cardHeading}>{heading}</Heading>
          )}
          {children}
        </div>
      </InnerCard>
    </div>
  )
}

const renderAst = new rehypeReact({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createElement: React.createElement as any,
  Fragment: React.Fragment,
  components: {
    details: Details,
    abbr: Abbr,
    a: Link,
    card: Card,
    cards: Cards
  }
}).Compiler

interface IMarkdownProps {
  htmlAst: object
  githubLink: string
  tutorials: { [type: string]: string }
  prev?: string
  next?: string
}

const Markdown: React.FC<IMarkdownProps> = ({
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
