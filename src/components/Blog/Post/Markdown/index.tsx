import React from 'react'
import rehypeReact from 'rehype-react'
import cn from 'classnames'

import * as styles from './styles.module.css'

interface IMarkdownProps {
  htmlAst: Node
}

const Admonition: React.FC<{
  title?: string
  type?: 'info' | 'tip' | 'warn'
}> = ({ title, type = 'info', children }) => {
  const genericTitles = {
    info: 'Info',
    tip: 'Tip',
    warn: 'Warning'
  }

  return (
    <div className={cn(styles.admonition, styles[type])}>
      <p className={styles.title}>{title || genericTitles[type]}</p>
      <div className={styles.content}>{children}</div>
    </div>
  )
}

// Rehype's typedefs don't allow for custom components, even though they work
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderAst = new (rehypeReact as any)({
  createElement: React.createElement,
  Fragment: React.Fragment,
  components: {
    admon: Admonition
  }
}).Compiler

const Markdown: React.FC<IMarkdownProps> = ({ htmlAst }) => {
  return <div className={styles.wrapper}>{renderAst(htmlAst)}</div>
}

export default Markdown
