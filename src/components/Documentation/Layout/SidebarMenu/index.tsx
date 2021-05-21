import React, { useEffect, useRef, useState, SyntheticEvent } from 'react'
import { useLocation } from '@reach/router'
import cn from 'classnames'
import { Collapse } from 'react-collapse'
import PerfectScrollbar from 'perfect-scrollbar'
import includes from 'lodash/includes'

import ShowOnly from '../../../ShowOnly'
import DownloadButton from '../../../DownloadButton'
import Link from '../../../Link'
import { ReactComponent as ExternalLinkIcon } from './external-link-icon.svg'
import { ReactComponent as HouseIcon } from './house.svg'
import { ReactComponent as CMLIcon } from './cml_bw_logo.svg'
import { ReactComponent as StudioIcon } from './studio_gray_icon.svg'

import {
  structure,
  getParentsListFromPath,
  getPathWithSource
} from '../../../../utils/shared/sidebar'

import 'perfect-scrollbar/css/perfect-scrollbar.css'
import styles from './styles.module.css'

// A map for optional special icons that can be used in menu items
// Use the key string here as the "icon" field in sidebar.json
const ICONS: { [key: string]: React.FC<{ className?: string }> } = {
  house: HouseIcon,
  cml: CMLIcon,
  studio: StudioIcon
}

interface ISidebarMenuItemProps {
  children?: Array<{ label: string; path: string; source: boolean | string }>
  label: string
  path: string
  source: boolean | string
  onClick: (isLeafItemClicked: boolean) => void
  activePaths?: Array<string>
  type?: string
  style?: string
  icon?: string
}

const SidebarMenuItem: React.FC<ISidebarMenuItemProps> = ({
  children,
  label,
  path,
  activePaths,
  onClick,
  style,
  icon,
  type
}) => {
  const [isExpanded, setIsExpanded] = useState(
    activePaths && includes(activePaths, path)
  )

  useEffect(() => {
    setIsExpanded(activePaths && includes(activePaths, path))
  }, [activePaths])

  const isRootParent =
    activePaths && activePaths.length > 1 && activePaths[0] === path

  const isLeafItem = children === undefined || children.length === 0

  const currentLevelOnClick = (
    event: SyntheticEvent<HTMLAnchorElement>
  ): void => {
    if (event.currentTarget.getAttribute('aria-current') === 'page') {
      event.preventDefault()
      setIsExpanded(!isExpanded)
    }
    onClick(isLeafItem)
  }

  const bulletIconClick = (event: SyntheticEvent<HTMLSpanElement>): void => {
    event.preventDefault()
    setIsExpanded(!isExpanded)
  }

  // Fetch a special icon if one is defined
  const IconComponent = icon && ICONS[icon]
  const iconElement = IconComponent ? (
    <IconComponent className={styles.specialIcon} />
  ) : null

  const className = cn(
    styles.sectionLink,
    isExpanded && styles.active,
    isRootParent && 'docSearch-lvl0',
    'link-with-focus',
    style ? styles[style] : styles.sidebarDefault,
    isLeafItem && styles.leafItem,
    // Limit the default bullet to items with no special icon
    icon ? undefined : styles.withDefaultBullet
  )

  const bulletIconClassName = cn(
    styles.sidebarDefaultBullet,
    isExpanded && styles.active,
    isLeafItem && styles.sidebarLeafBullet
  )

  const parentElement =
    type === 'external' ? (
      <Link
        href={path}
        id={path}
        className={className}
        onClick={currentLevelOnClick}
        target="_blank"
      >
        {iconElement ? (
          iconElement
        ) : (
          <span className={bulletIconClassName}></span>
        )}
        {label} <ExternalLinkIcon />
      </Link>
    ) : (
      <Link
        href={getPathWithSource(path)}
        id={path}
        className={className}
        onClick={currentLevelOnClick}
      >
        {iconElement ? (
          iconElement
        ) : (
          <span
            className={bulletIconClassName}
            onClick={bulletIconClick}
            onKeyDown={bulletIconClick}
            role="button"
            tabIndex={0}
          ></span>
        )}
        {label}
      </Link>
    )

  return (
    <>
      {parentElement}
      {children && (
        <span hidden={!isExpanded}>
          <Collapse isOpened={!!isExpanded}>
            {children.map(item => (
              <SidebarMenuItem
                key={item.path}
                activePaths={activePaths}
                onClick={onClick}
                {...item}
              />
            ))}
          </Collapse>
        </span>
      )}
    </>
  )
}

interface ISidebarMenuProps {
  currentPath: string
  onClick: (isLeafItemClicked: boolean) => void
}

const SidebarMenu: React.FC<ISidebarMenuProps> = ({ currentPath, onClick }) => {
  const location = useLocation()
  const rootRef = useRef<HTMLDivElement>(null)
  const psRef = useRef<PerfectScrollbar | undefined>(undefined)
  const [isScrollHidden, setIsScrollHidden] = useState(false)
  const activePaths = currentPath && getParentsListFromPath(currentPath)

  const scrollToActiveItem = (): void => {
    const node = document.getElementById(currentPath)
    const parent = rootRef.current

    setIsScrollHidden(true)
    setTimeout(() => {
      if (node && parent) {
        psRef.current?.update()

        const parentHeight = parent.clientHeight
        const parentScroll = parent.scrollTop
        const nodeOffset = node.offsetTop
        const nodeHeight = node.clientHeight
        const scrollOffset = nodeOffset - parentHeight + nodeHeight

        if (
          parentScroll > nodeOffset + nodeHeight ||
          parentScroll + parentHeight < nodeOffset
        ) {
          parent.scrollTop = scrollOffset
        }
      }

      setIsScrollHidden(false)
    }, 400)
  }

  useEffect(() => {
    if (!psRef.current && rootRef.current) {
      psRef.current = new PerfectScrollbar(rootRef.current, {
        wheelPropagation: true
      })
    }

    scrollToActiveItem()

    return (): void => {
      psRef.current?.destroy()
      psRef.current = undefined
    }
  }, [])
  useEffect(scrollToActiveItem, [location.pathname])

  return (
    <div
      className={cn(styles.menu, isScrollHidden && styles.isScrollHidden)}
      ref={rootRef}
    >
      <div className={styles.sections}>
        <div className={styles.sectionLinks}>
          {structure.map(item => (
            <SidebarMenuItem
              key={item.path}
              activePaths={
                includes(activePaths, item.path) ? activePaths : undefined
              }
              onClick={onClick}
              {...item}
            />
          ))}
        </div>
      </div>
      <ShowOnly on="desktop">
        <div className={styles.footer}>
          <DownloadButton openTop />
        </div>
      </ShowOnly>
    </div>
  )
}

export default SidebarMenu
