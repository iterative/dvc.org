import React, {
  useEffect,
  useState,
  useRef,
  ReactNode,
  ReactElement,
  useContext,
  useMemo
} from 'react'
import cn from 'classnames'
import { nanoid } from 'nanoid'
import { Node } from 'unist'
import rehypeReact from 'rehype-react'
import Collapsible from 'react-collapsible'

import Main from './Main'
import Link from '../../Link'
import Tooltip from './Tooltip'
import Admonition from './Admonition'

import * as styles from './styles.module.css'
import { TogglesContext, TogglesProvider } from './ToggleProvider'
import { linkIcon } from '../../../../../../static/icons'
import { useLocation } from '@reach/router'

import Slugger from '../../../utils/front/Slugger'

const Details: React.FC<{ slugger: Slugger; id: string }> = ({
  slugger,
  children,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const filteredChildren: ReactNode[] = (
    children as Array<{ props: { children: ReactNode } } | string>
  ).filter(child => child !== '\n')
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

  const title = (triggerChildren as any[]).reduce((acc, cur) => {
    return (acc +=
      typeof cur === 'string'
        ? cur
        : typeof cur === 'object'
        ? cur?.props?.children?.toString()
        : '')
  }, '')
  id = useMemo(() => {
    return id ? slugger.slug(id) : slugger.slug(title)
  }, [id, title])

  useEffect(() => {
    if (location.hash === `#${id}`) {
      setIsOpen(true)
    }

    return () => {
      setIsOpen(false)
    }
  }, [location.hash])

  /*
     Collapsible's trigger type wants ReactElement, so we force a TS cast from
     ReactNode here.
   */
  return (
    <div id={id} className="collapsableDiv">
      <Link
        href={`#${id}`}
        aria-label={triggerChildren.toString()}
        className="anchor after"
      >
        <span dangerouslySetInnerHTML={{ __html: linkIcon }}></span>
      </Link>
      <Collapsible
        open={isOpen}
        trigger={triggerChildren as unknown as ReactElement}
        transitionTime={200}
      >
        {filteredChildren.slice(1)}
      </Collapsible>
    </div>
  )
}

const Abbr: React.FC<Record<string, never>> = ({ children }) => {
  return <Tooltip text={(children as string[])[0]} />
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

const ToggleTab: React.FC<{
  id: string
  title: string
  ind: number
  onChange: () => void
  checked: boolean
}> = ({ children, id, checked, ind, onChange, title }) => {
  const inputId = `tab-${id}-${ind}`

  return (
    <>
      <input
        id={inputId}
        type="radio"
        name={`toggle-${id}`}
        onChange={onChange}
        checked={checked}
      />
      <label className={styles.tabHeading} htmlFor={inputId}>
        {title}
      </label>
      {children}
    </>
  )
}

const Toggle: React.FC<{
  height?: string
  children: Array<{ props: { title: string } } | string>
}> = ({ height, children }) => {
  const [toggleId, setToggleId] = useState('')
  const {
    addNewToggle = (): null => null,
    updateToggleInd = (): null => null,
    togglesData = {}
  } = useContext(TogglesContext)
  const tabs: Array<{ props: { title: string } } | string> = children.filter(
    child => child !== '\n'
  )
  const tabsTitles = tabs.map(tab =>
    typeof tab === 'object' ? tab.props.title : ''
  )
  const toggleEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tabParent =
      toggleEl.current && toggleEl.current.closest('.toggle .tab')
    const labelParentText =
      tabParent &&
      tabParent.previousElementSibling &&
      tabParent.previousElementSibling.textContent

    if (toggleId === '') {
      const newId = nanoid()
      addNewToggle(newId, tabsTitles, labelParentText)
      setToggleId(newId)
    }

    if (toggleId && !togglesData[toggleId]) {
      addNewToggle(toggleId, tabsTitles, labelParentText)
    }
  }, [togglesData])

  return (
    <div className={cn('toggle', styles.toggle)} ref={toggleEl}>
      {tabs.map((tab, i) => (
        <ToggleTab
          ind={i}
          key={i}
          title={tabsTitles[i]}
          id={toggleId}
          checked={
            i === (togglesData[toggleId] ? togglesData[toggleId].checkedInd : 0)
          }
          onChange={(): void => updateToggleInd(toggleId, i)}
        >
          <div
            className={cn('tab', styles.tab)}
            style={{
              minHeight: height
            }}
          >
            {tab}
          </div>
        </ToggleTab>
      ))}
    </div>
  )
}
const Tab: React.FC = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>
}

// Rehype's typedefs don't allow for custom components, even though they work
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderAst = (slugger: Slugger) => {
  return new (rehypeReact as any)({
    createElement: React.createElement,
    Fragment: React.Fragment,
    components: {
      a: Link,
      abbr: Abbr,
      card: Card,
      cards: Cards,
      details: (props: any) => <Details slugger={slugger} {...props} />,
      toggle: Toggle,
      tab: Tab,
      admon: Admonition,
      admonition: Admonition
    }
  }).Compiler
}
interface IMarkdownProps {
  htmlAst: Node
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
  const slugger = new Slugger()
  return (
    <Main prev={prev} next={next} tutorials={tutorials} githubLink={githubLink}>
      <TogglesProvider>{renderAst(slugger)(htmlAst)}</TogglesProvider>
    </Main>
  )
}

export default Markdown
