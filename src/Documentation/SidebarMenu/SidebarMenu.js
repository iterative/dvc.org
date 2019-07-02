import React, { Fragment } from 'react'
import $ from 'jquery'
import DownloadButton from '../../DownloadButton'
import styled from 'styled-components'
import { media, OnlyDesktop } from '../../styles'
import sidebar from '../sidebar'
import Preloader from '../../Preloader/Preloader'
import SidebarHelper from './SideHelper'
const MENU_ID = 'sidebar-menu'
export default class SidebarMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      names: [],
      loading: true
    }
  }

  collapse = () => {
    setTimeout(function() {
      $('[data-open=true]').slideDown()
      $('[data-open=false]').slideUp()
    })
  }

  componentDidMount() {
    this.collapse()
    const names = SidebarHelper.getNamesArr(sidebar)
    this.setState({
      names: names,
      loading: false
    })
  }

  componentWillReceiveProps(nextProps) {
    let con1 = nextProps.currentFile !== this.props.currentFile
    let con2 = nextProps.currentSection !== this.props.currentSection
    if (con1 || con2) {
      this.collapse()
    }
  }

  renderPreloader = () => {
    return (
      <Menu id={MENU_ID}>
        <PreloaderWrapper>
          <Preloader size={24} />
        </PreloaderWrapper>
      </Menu>
    )
  }

  renderSection = (section, file, index, fileIndex) => {
    const { getLinkHref, onFileSelect, currentFile } = this.props
    const subgroup = file.files || null
    const folderPath = SidebarHelper.getFullPath(file.folder, file.indexFile)
    const sectionPath = SidebarHelper.getFullPath(section.folder, file)
    let compare = file.folder && file.indexFile ? folderPath : sectionPath
    const isFileActive = currentFile === compare
    let FileOrSubsectionTitle =
      file.name ||
      SidebarHelper.getName(
        section.labels,
        SidebarHelper.getParentFolder(file, section),
        file.indexFile || file,
        this.state.names
      )
    return (
      <Fragment key={`file-${fileIndex}`}>
        <div>
          <SectionLink
            level={2}
            href={getLinkHref(index, null, file.indexFile)}
            onClick={e => onFileSelect(index, null, file, e)}
            isActive={isFileActive}
          >
            {FileOrSubsectionTitle}
          </SectionLink>
        </div>
        {subgroup && (
          <Collapse
            data-flag={'first'}
            data-open={SidebarHelper.convertToBooleanString(
              isFileActive ||
                SidebarHelper.filesContains(
                  subgroup,
                  SidebarHelper.getParentFolder(file, section),
                  currentFile
                )
            )}
          >
            {subgroup.map((subFile, subIndex) => {
              return this.renderSubgroup(
                section,
                file,
                index,
                subFile,
                fileIndex,
                subIndex
              )
            })}
          </Collapse>
        )}
      </Fragment>
    )
  }

  renderSubgroup = (section, file, index, subFile, fileIndex, subIndex) => {
    const { getLinkHref, onFileSelect, currentFile } = this.props
    const fileFolder = file.folder || section.folder
    const subFilePath = SidebarHelper.getFullPath(fileFolder, subFile)
    return (
      <div key={`file-${fileIndex}-${subIndex}`}>
        <SectionLink
          level={3}
          href={getLinkHref(index, fileIndex, subFile)}
          onClick={e => onFileSelect(index, fileIndex, subFile, e)}
          isActive={currentFile === subFilePath}
        >
          {SidebarHelper.getName(
            file.labels,
            file.folder || section.folder,
            subFile,
            this.state.names
          )}
        </SectionLink>
      </div>
    )
  }

  renderMenu = (section, index) => {
    const { currentSection, onSectionSelect, getLinkHref } = this.props
    const isSectionActive = currentSection === index
    let sectionTitle =
      section.name ||
      SidebarHelper.getName(
        section.labels,
        section.folder,
        section.indexFile,
        this.state.names
      )
    return (
      <div key={index}>
        <SectionLink
          level={1}
          href={getLinkHref(index)}
          onClick={e => onSectionSelect(index, e)}
          className={isSectionActive ? 'docSearch-lvl0' : ''}
          isActive={isSectionActive}
        >
          {sectionTitle}
        </SectionLink>
        <Collapse
          data-open={SidebarHelper.convertToBooleanString(isSectionActive)}
        >
          {section.files &&
            section.files.map((file, fileIndex) => {
              return this.renderSection(section, file, index, fileIndex)
            })}
        </Collapse>
      </div>
    )
  }

  renderContent = () => {
    const { sidebar } = this.props
    return (
      <Menu id={MENU_ID}>
        <Sections>
          <SectionLinks>
            {sidebar.map((section, index) => {
              return this.renderMenu(section, index)
            })}
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

  render = () => {
    const { loading } = this.state
    return loading ? this.renderPreloader() : this.renderContent()
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
  margin: 0;
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
  ${props =>
    props.level === 1 &&
    `
    margin-left: 5px;
  `} ${props =>
    props.level === 2 &&
    `
    margin-left: 30px;
  `};
  ${props =>
    props.level === 3 &&
    `
    margin-left: 45px;
    &::before {
      display: none;
    }
  `};
  ${props =>
    props.isActive &&
    `
    color: #40364d;
	`};
`
const Collapse = styled.div`
  display: none;
`
const SideFooter = styled.div`
  margin-top: 30px;
  padding-bottom: 30px;
`
const PreloaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  margin: 44px 34px 0px 0px;
`
