import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from '@reach/router'
import cn from 'classnames'
import { Collapse } from 'react-collapse'
import PerfectScrollbar from 'perfect-scrollbar'
import includes from 'lodash/includes'

import ShowOnly from '../../../ShowOnly'
import DownloadButton from '../../../DownloadButton'
import Link from '../../../Link'
import { ReactComponent as ExternalLinkIcon } from './external-link-icon.svg'

import {
  structure,
  getParentsListFromPath,
  getPathWithSource
} from '../../../../utils/shared/sidebar'

import 'perfect-scrollbar/css/perfect-scrollbar.css'
import styles from './styles.module.css'

interface ISidebarMenuItemProps {
  children?: Array<{ label: string; path: string; source: boolean | string }>
  label: string
  path: string
  source: boolean | string
  onClick: (isLeafItemClicked: boolean) => void
  activePaths?: Array<string>
  type?: string
}

const SidebarMenuItem: React.FC<ISidebarMenuItemProps> = ({
  children,
  label,
  path,
  activePaths,
  onClick,
  type
}) => {
  const isActive = activePaths && includes(activePaths, path)
  const isRootParent =
    activePaths && activePaths.length > 1 && activePaths[0] === path
  const isLeafItem = children === undefined || children.length === 0
  const currentLevelOnClick = (): void => onClick(isLeafItem)

  const className = cn(
    styles.sectionLink,
    isActive && styles.active,
    isRootParent && 'docSearch-lvl0',
    'link-with-focus'
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
        {label} <ExternalLinkIcon />
      </Link>
    ) : (
      <Link
        href={getPathWithSource(path)}
        id={path}
        className={className}
        onClick={currentLevelOnClick}
      >
        {label}
      </Link>
    )

  return (
    <>
      {parentElement}
      {children && (
        <Collapse isOpened={!!isActive}>
          {children.map(item => (
            <SidebarMenuItem
              key={item.path}
              activePaths={activePaths}
              onClick={onClick}
              {...item}
            />
          ))}
        </Collapse>
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
