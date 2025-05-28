import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useLocation } from '@gatsbyjs/reach-router'
import Collapsible from 'react-collapsible'
import Slugger from '../../../../utils/front/Slugger'
import { ReactComponent as LinkIcon } from '../../../../images/linkIcon.svg'
import Link from '../../../Link'
import Tooltip from '../Tooltip'
import * as styles from '../styles.module.css'

type RemarkNode = { props: { children: RemarkNode[] } } | string

export const Details: React.FC<
  PropsWithChildren<{ slugger: Slugger; id: string }>
> = ({ slugger, children, id }) => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const filteredChildren = (children as Array<RemarkNode>).filter(
    child => child !== '\n'
  )
  const firstChild = filteredChildren[0] as JSX.Element

  if (!/^h.$/.test(firstChild.type)) {
    throw new Error('The first child of a details element must be a heading!')
  }

  /*
     To work around auto-linked headings, the last child of the heading node
     must be removed. The only way around this is the change the autolinker,
     which we currently have as an external package.
   */
  const triggerChildren: RemarkNode[] = firstChild.props.children.slice(
    0,
    firstChild.props.children.length - 1
  )

  const title = triggerChildren.reduce<string>((acc, cur) => {
    return (acc +=
      typeof cur === 'string'
        ? cur
        : typeof cur === 'object'
          ? cur?.props?.children?.toString()
          : '')
  }, '')
  id = useMemo(() => {
    return id ? slugger.slug(id) : slugger.slug(title)
  }, [id, slugger, title])

  useEffect(() => {
    if (location.hash === `#${id}`) {
      setIsOpen(true)
    }

    return () => {
      setIsOpen(false)
    }
  }, [id, location.hash])

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
        <LinkIcon />
      </Link>
      <Collapsible
        open={isOpen}
        trigger={triggerChildren as unknown as ReactElement}
        transitionTime={200}
      >
        {filteredChildren.slice(1) as ReactNode}
      </Collapsible>
    </div>
  )
}

export const Abbr: React.FC<Record<string, never>> = ({ children }) => {
  return <Tooltip text={(children as string[])[0]} />
}

export const Cards: React.FC<PropsWithChildren<Record<never, never>>> = ({
  children
}) => {
  return <div className={styles.cards}>{children}</div>
}

export const InnerCard: React.FC<
  PropsWithChildren<{
    href?: string
    className?: string
  }>
> = ({ href, children, className }) =>
  href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  )

export const Card: React.FC<
  PropsWithChildren<{
    icon?: string
    heading?: string
    headingicon?: string
    href?: string
    headingtag:
      | string
      | React.FC<
          PropsWithChildren<{
            className: string
          }>
        >
  }>
> = ({
  children,
  icon,
  heading,
  headingicon,
  headingtag: Heading = 'h3',
  href
}) => {
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
            <Heading className={styles.cardHeading}>
              {headingicon && (
                <img
                  src={headingicon}
                  alt="Heading Icon"
                  className={styles.cardHeadingIcon}
                />
              )}
              {heading}
            </Heading>
          )}
          {children}
        </div>
      </InnerCard>
    </div>
  )
}
