import React, { useEffect, useRef, useState } from 'react'
import PerfectScrollbar from 'perfect-scrollbar'
import scrollIntoView from 'dom-scroll-into-view'
import PropTypes from 'prop-types'
import includes from 'lodash.includes'

import DownloadButton from '../../DownloadButton'
import LocalLink from '../../LocalLink'

import { getParentsListFromPath } from '../../../utils/sidebar'

import { OnlyDesktop } from '../../../styles'

import {
  Collapse,
  Menu,
  SectionLink,
  SectionLinks,
  Sections,
  SideFooter
} from './styles'

/** Height of each menu child items (to calc Element weight for animations) */
const heightMap = {}

/** Calculate element height with all open children. */
function calculateHeight({ activePaths, path }) {
  let height = 0
  const reversePaths = [...activePaths].reverse()

  for (let i = 0; i < reversePaths.length; i++) {
    const current = reversePaths[i]

    height += heightMap[current] ? heightMap[current] : 0

    if (path === current) break
  }

  return height
}

function SidebarMenuItem({ children, label, path, activePaths, onClick }) {
  const linkRef = useRef()
  const isActive = activePaths && includes(activePaths, path)
  const isRootParent =
    activePaths && activePaths.length > 1 && activePaths[0] === path

  useEffect(() => {
    heightMap[path] = children ? linkRef.current.scrollHeight : 0
  }, [])

  return (
    <>
      <LocalLink
        href={path}
        as={SectionLink}
        id={path}
        isActive={isActive}
        onClick={onClick}
        className={isRootParent ? 'docSearch-lvl0' : ''}
      >
        {label}
      </LocalLink>
      {children && (
        <Collapse
          style={
            isActive ? { height: calculateHeight({ activePaths, path }) } : {}
          }
          ref={linkRef}
        >
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

SidebarMenuItem.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  activePaths: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.bool
  ]).isRequired
}

export default function SidebarMenu({ id, sidebar, currentPath, onClick }) {
  const psRef = useRef()
  const [isScrollHidden, setIsScrollHidden] = useState(false)
  const activePaths = currentPath && getParentsListFromPath(currentPath)

  useEffect(() => {
    if (!psRef.current) {
      psRef.current = new PerfectScrollbar(`#${id}`, {
        wheelPropagation: true
      })
    }

    const node = document.getElementById(currentPath)
    const parent = document.getElementById(id)

    setIsScrollHidden(true)

    setTimeout(() => {
      psRef.current.update()
      scrollIntoView(node, parent, { onlyScrollIfNeeded: true })
      setIsScrollHidden(false)
    }, 400)

    return () => {
      psRef.current.destroy()
      psRef.current = null
    }
  }, [currentPath])

  return (
    <Menu id={id} isScrollHidden={isScrollHidden}>
      <Sections>
        <SectionLinks>
          {sidebar.map(item => (
            <SidebarMenuItem
              key={item.path}
              activePaths={includes(activePaths, item.path) && activePaths}
              onClick={onClick}
              {...item}
            />
          ))}
        </SectionLinks>
      </Sections>
      <OnlyDesktop>
        <SideFooter>
          <DownloadButton openTop />
        </SideFooter>
      </OnlyDesktop>
    </Menu>
  )
}

SidebarMenu.propTypes = {
  id: PropTypes.string.isRequired,
  sidebar: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentPath: PropTypes.string,
  onClick: PropTypes.func
}
