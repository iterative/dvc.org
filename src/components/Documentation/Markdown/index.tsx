import React, { ReactNode, ReactElement } from 'react'
import rehypeReact from 'rehype-react'
import Collapsible from 'react-collapsible'

import Main from './Main'
import Link from '../../Link'
import Tooltip from './Tooltip'

import styles from './styles.module.css'

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
  return (
    <Main prev={prev} next={next} tutorials={tutorials} githubLink={githubLink}>
      {renderAst(htmlAst)}
    </Main>
  )
}

export default Markdown
