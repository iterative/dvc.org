import React, { Component } from 'react'
import PerfectScrollbar from 'perfect-scrollbar'
import scrollIntoView from 'dom-scroll-into-view'
import PropTypes from 'prop-types'

// components
import DownloadButton from '../../DownloadButton'
// utils
import includes from 'lodash.includes'
// styles
import styled from 'styled-components'
import { media, OnlyDesktop } from '../../styles'
// sidebar helpers
import { getParentsListFromPath } from './helper'

/** Height of each menu child items (to calc Element weight for animations) */
const heightMap = {}

/** Calculate element height with all open children. */
function calculateHeight({ activePaths, path }) {
  let height = 0
  const reversePaths = [...activePaths].reverse()

  for (let i = 0; i < reversePaths.length; i++) {
    const current = reversePaths[i]

    height += heightMap[current]

    if (path === current) break
  }

  return height
}

class SidebarMenuItem extends React.PureComponent {
  componentDidMount() {
    heightMap[this.props.path] = this.props.children
      ? this.linkRef.scrollHeight
      : 0
  }

  render() {
    const { children, label, path, activePaths } = this.props
    const isActive = activePaths && includes(activePaths, path)
    const isRootParent =
      activePaths && activePaths.length > 1 && activePaths[0] === path

    return (
      <>
        <SectionLink
          href={path}
          id={path}
          isActive={isActive}
          className={isRootParent ? 'docSearch-lvl0' : ''}
        >
          {label}
        </SectionLink>
        {children && (
          <Collapse
            style={isActive ? { height: calculateHeight(this.props) } : {}}
            ref={r => (this.linkRef = r)}
          >
            {children.map(item => (
              <SidebarMenuItem
                key={item.path}
                activePaths={activePaths}
                {...item}
              />
            ))}
          </Collapse>
        )}
      </>
    )
  }
}

SidebarMenuItem.propTypes = {
  children: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  activePaths: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.bool
  ]).isRequired
}

export default class SidebarMenu extends Component {
  state = {
    isScrollHidden: false
  }

  componentDidMount() {
    this.ps = new PerfectScrollbar(`#${this.props.id}`, {
      // wheelPropagation: window.innerWidth <= 572
      wheelPropagation: true
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentPath === this.props.currentPath) return

    const node = document.getElementById(this.props.currentPath)
    const parent = document.getElementById(this.props.id)

    this.setState({ isScrollHidden: true }, () =>
      setTimeout(() => {
        this.ps.update()
        scrollIntoView(node, parent, { onlyScrollIfNeeded: true })
        this.setState({ isScrollHidden: false })
      }, 400)
    )
  }

  render() {
    const { id, sidebar, currentPath } = this.props
    const activePaths = currentPath && getParentsListFromPath(currentPath)

    return (
      <Menu id={id} isScrollHidden={this.state.isScrollHidden}>
        <Sections>
          <SectionLinks>
            {sidebar.map(item => (
              <SidebarMenuItem
                key={item.path}
                activePaths={includes(activePaths, item.path) && activePaths}
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
}

SidebarMenu.propTypes = {
  id: PropTypes.string.isRequired,
  sidebar: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentPath: PropTypes.string
}

const Menu = styled.div`
  position: sticky;
  top: 60px;
  height: calc(100vh - 138px);
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;

  ${props =>
    props.isScrollHidden &&
    `
    .ps__rail-y { opacity: 0; overflow: hidden; }
  `};

  ${media.phablet`
    position: relative;
    top: 0;
    height: calc(100% - 60px);
    padding-left: 20px;
  `};
`

const Sections = styled.div`
  margin-bottom: 25px;
  margin-top: 10px;
  min-width: 280px;

  ${media.phablet`
    min-width: auto;
  `}
`

const SectionLinks = styled.div`
  @media (max-width: 768px) {
    position: relative;
  }
`

const SectionLink = styled.a`
  display: block;
  position: relative;
  font-size: 18px;
  font-weight: 500;
  color: #b0b8c5;
  text-decoration: none;
  font-weight: 400;
  line-height: 26px;
  min-height: 26px;
  padding-bottom: 5px;
  padding-left: 15px;
  cursor: pointer;
  margin: 0 0 0 5px;

  ${props =>
    props.isActive &&
    `
    color: #40364d;
  `};

  &:hover {
    color: #3c3937;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 8px;
    height: 5px;
    background: url('/static/img/triangle_dark.svg') no-repeat center center;
    left: 0px;
    top: 10px;

    ${props =>
      props.isActive &&
      `
      transform: rotate(-90deg);
    `};
  }
`

const Collapse = styled.div`
  overflow: hidden;
  height: 0;
  transition: height 400ms;
  padding-left: 20px;
`

const SideFooter = styled.div`
  margin-top: 30px;
  padding-bottom: 30px;
`
