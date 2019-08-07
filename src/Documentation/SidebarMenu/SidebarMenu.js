import React from 'react'
import $ from 'jquery'
import PerfectScrollbar from 'perfect-scrollbar'
// components
import DownloadButton from '../../DownloadButton'
// styles
import styled from 'styled-components'
import { media, OnlyDesktop } from '../../styles'
// sidebar helpers
import { getParentsListFromPath } from './helper'

function SidebarMenuItem({ children, label, path, activePaths, onNavigate }) {
  const isActive = activePaths && activePaths.includes(path)
  const isRootParent =
    activePaths && activePaths.length > 1 && activePaths[0] === path

  return (
    <>
      <SectionLink
        href={path}
        onClick={e => onNavigate(path, e)}
        isActive={isActive}
        className={isRootParent ? 'docSearch-lvl0' : ''}
      >
        {label}
      </SectionLink>
      {children && (
        <Collapse data-open={isActive ? 'true' : 'false'}>
          {children.map(item => (
            <SidebarMenuItem
              key={item.path}
              activePaths={activePaths}
              onNavigate={onNavigate}
              {...item}
            />
          ))}
        </Collapse>
      )}
    </>
  )
}

export default class SidebarMenu extends React.Component {
  constructor(props) {
    super(props)
    this.collapse = this.collapse.bind(this)
  }
  collapse() {
    setTimeout(function() {
      $('[data-open=true]').slideDown()
      $('[data-open=false]').slideUp()
    })
  }
  componentDidMount() {
    this.collapse()

    this.ps = new PerfectScrollbar('#sidebar-menu', {
      // wheelPropagation: window.innerWidth <= 572
      wheelPropagation: true
    })
  }

  componentDidUpdate() {
    this.ps.update()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPath !== this.props.currentPath) {
      this.collapse()
    }
  }
  render() {
    const { sidebar, currentPath, onNavigate } = this.props
    const activePaths = currentPath && getParentsListFromPath(currentPath)

    return (
      <Menu id="sidebar-menu">
        <Sections>
          <SectionLinks>
            {sidebar.map(item => (
              <SidebarMenuItem
                key={item.path}
                activePaths={activePaths}
                onNavigate={onNavigate}
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

const Menu = styled.div`
  position: sticky;
  top: 60px;
  width: 100%;
  height: calc(100vh - 138px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  ${media.phablet`
    width: auto;
    position: relative;
    margin: 0;
    top: 0;
    overflow-y: auto;
    margin-left: 20px;
  `};
`

const Sections = styled.div`
  margin-bottom: 25px;
  margin-top: 10px;
  min-width: 280px;
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
  display: none;
  padding-left: 20px;
`

const SideFooter = styled.div`
  margin-top: 30px;
  padding-bottom: 30px;
`
