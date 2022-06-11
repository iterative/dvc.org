import React from 'react'
import rehypeReact from 'rehype-react'
import Admonition from '@dvcorg/gatsby-theme-iterative/src/components/Documentation/Markdown/Admonition'

import * as styles from './styles.module.css'

interface IMarkdownProps {
  htmlAst: Node
}

// Rehype's typedefs don't allow for custom components, even though they work
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderAst = new (rehypeReact as any)({
  createElement: React.createElement,
  Fragment: React.Fragment,
  components: {
    admon: Admonition,
    admonition: Admonition
  }
}).Compiler

const Markdown: React.FC<IMarkdownProps> = ({ htmlAst }) => {
  return <div className={styles.wrapper}>{renderAst(htmlAst)}</div>
}

export default Markdown
