import cn from 'classnames'
import type { Element } from 'hast'
import { Fragment, ReactNode, createElement } from 'react'
import rehypeReact from 'rehype-react'

import Admonition from '@dvcorg/gatsby-theme/src/components/Documentation/Markdown/Admonition'
import * as themeStyles from '@dvcorg/gatsby-theme/src/components/Documentation/Markdown/Main/theme.module.css'
import {
  Toggle,
  Tab
} from '@dvcorg/gatsby-theme/src/components/Documentation/Markdown/ToggleProvider'

import * as styles from './styles.module.css'

interface IMarkdownProps {
  htmlAst: Element
}

const HoverSwitchImage = ({
  children
}: {
  children: (ReactNode | string)[]
}) => {
  const [defaultImage, hoverImage] = children.filter(
    child => typeof child !== `string`
  )
  return (
    <div className={styles.hoverSwitcher}>
      <div className={styles.hoverSwitcherDefault}>{defaultImage}</div>
      <div className={styles.hoverSwitcherAlt}>{hoverImage}</div>
    </div>
  )
}

// Rehype's typedefs don't allow for custom components, even though they work

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderAst = new (rehypeReact as any)({
  createElement,
  Fragment,
  components: {
    admon: Admonition,
    admonition: Admonition,
    toggle: Toggle,
    tab: Tab,
    hoverswitcher: HoverSwitchImage,
    table: ({ children }: { children: ReactNode[] }) => (
      <div className={cn(`overflow-x-auto`)}>
        <table>{children}</table>
      </div>
    )
  }
}).Compiler

const Markdown: React.FC<IMarkdownProps> = ({ htmlAst }) => {
  return (
    <div className={cn(styles.wrapper, themeStyles.code)}>
      {renderAst(htmlAst)}
    </div>
  )
}

export default Markdown
