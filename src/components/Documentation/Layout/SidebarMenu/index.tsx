import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { Collapse } from 'react-collapse'
import PerfectScrollbar from 'perfect-scrollbar'
import includes from 'lodash.includes'

import ShowOnly from '../../../ShowOnly'
import DownloadButton from '../../../DownloadButton'
import Link from '../../../Link'

import {
  structure,
  getParentsListFromPath,
  getPathWithSoruce
} from '../../../../utils/shared/sidebar'

import 'perfect-scrollbar/css/perfect-scrollbar.css'
import styles from './styles.module.css'

interface ISidebarMenuItemProps {
  children?: Array<{ label: string; path: string; source: boolean | string }>
  label: string
  path: string
  source: boolean | string
  onClick: (e: React.MouseEvent) => void
  activePaths?: Array<string>
}

const SidebarMenuItem: React.SFC<ISidebarMenuItemProps> = ({
  children,
  label,
  path,
  activePaths,
  onClick
}) => {
  const isActive = activePaths && includes(activePaths, path)
  const isRootParent =
    activePaths && activePaths.length > 1 && activePaths[0] === path

  return (
    <>
      <Link
        href={getPathWithSoruce(path)}
        id={path}
        className={cn(
          styles.sectionLink,
          isActive && styles.active,
          isRootParent && 'docSearch-lvl0'
        )}
        onClick={onClick}
      >
        {label}
      </Link>
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
  onClick: (e: React.MouseEvent) => void
}

const SidebarMenu: React.SFC<ISidebarMenuProps> = ({
  currentPath,
  onClick
}) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const psRef = useRef<PerfectScrollbar | undefined>(undefined)
  const [isScrollHidden, setIsScrollHidden] = useState(false)
  const activePaths = currentPath && getParentsListFromPath(currentPath)

  useEffect(() => {
    if (!psRef.current && rootRef.current) {
      psRef.current = new PerfectScrollbar(rootRef.current, {
        wheelPropagation: true
      })
    }

    const node = document.getElementById(currentPath)
    const parent = rootRef.current

    setIsScrollHidden(true)

    const timeout = setTimeout(() => {
      psRef.current?.update()

      if (node && parent) {
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

    return (): void => {
      clearTimeout(timeout)
      psRef.current?.destroy()
      psRef.current = undefined
    }
  }, [])

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
