import React, { useEffect, useRef, useState } from 'react'
import { Collapse } from 'react-collapse'
import PerfectScrollbar from 'perfect-scrollbar'
import PropTypes from 'prop-types'
import includes from 'lodash.includes'

import 'perfect-scrollbar/css/perfect-scrollbar.css'

import DownloadButton from '../../DownloadButton'
import Link from '../../Link'

import {
  getParentsListFromPath,
  getPathWithSoruce
} from '../../../utils/sidebar'

import { OnlyDesktop } from '../../../styles'

import { Menu, SectionLink, SectionLinks, Sections, SideFooter } from './styles'

function SidebarMenuItem({ children, label, path, activePaths, onClick }) {
  const isActive = activePaths && includes(activePaths, path)
  const isRootParent =
    activePaths && activePaths.length > 1 && activePaths[0] === path

  return (
    <>
      <Link
        href={getPathWithSoruce(path)}
        as={SectionLink}
        id={path}
        isActive={isActive}
        onClick={onClick}
        className={isRootParent ? 'docSearch-lvl0' : ''}
      >
        {label}
      </Link>
      {children && (
        <Collapse isOpened={isActive}>
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
  source: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
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

    const timeout = setTimeout(() => {
      psRef.current.update()

      if (node && parent) {
        const scrollOffset =
          node.offsetTop - parent.clientHeight + node.clientHeight

        parent.scrollTop = scrollOffset
      }

      setIsScrollHidden(false)
    }, 400)

    return () => {
      clearTimeout(timeout)
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
