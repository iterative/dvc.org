import React, { Fragment } from 'react'
import $ from 'jquery'
import DownloadButton from '../../DownloadButton'
import styled from 'styled-components'
import { media, OnlyDesktop } from '../../styles'
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
    const names = SidebarHelper.getNamesArr(this.props.sidebar)
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
  //done
  renderSection = (file, sectionIndex, fileIndex) => {
    const { getLinkHref, onFileSelect, currentFile } = this.props
    const subgroup = file.files
    const isFileActive = currentFile === file.folder + '/' + file.indexFile
    let FileOrSubsectionTitle = file.name
    return (
      <Fragment key={`file-${fileIndex}`}>
        <div>
          <SectionLink
            level={file.level}
            href={getLinkHref(sectionIndex, file.indexFile)}
            onClick={e =>
              onFileSelect(sectionIndex, file.indexFile, file.folder, e)
            }
            isActive={isFileActive}
          >
            {FileOrSubsectionTitle}
          </SectionLink>
        </div>
        {subgroup && subgroup.length > 0 && (
          <Collapse
            data-flag={'first'}
            data-open={SidebarHelper.convertToBooleanString(
              isFileActive ||
                SidebarHelper.filesContains(subgroup, file.folder, currentFile)
            )}
          >
            {subgroup.map((subFile, subIndex) => {
              return this.renderSubgroup(
                sectionIndex,
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

  renderSubgroup = (sectionIndex, subFile, fileIndex, subIndex) => {
    const { getLinkHref, onFileSelect, currentFile } = this.props
    const subFilePath = SidebarHelper.combineToPath([
      subFile.folder,
      subFile.indexFile
    ])
    return (
      <div key={`file-${fileIndex}-${subIndex}`}>
        <SectionLink
          level={3}
          href={getLinkHref(sectionIndex, subFile.indexFile)}
          onClick={e =>
            onFileSelect(sectionIndex, subFile.indexFile, subFile.folder, e)
          }
          isActive={currentFile === subFilePath}
        >
          {subFile.name}
        </SectionLink>
      </div>
    )
  }
  //done
  renderMenu = (section, sectionIndex) => {
    const { currentSection, onSectionSelect, getLinkHref } = this.props
    const isSectionActive = currentSection === sectionIndex
    let sectionTitle = section.name
    return (
      <div key={sectionIndex}>
        <SectionLink
          level={section.level}
          href={getLinkHref(sectionIndex, section.indexFile)}
          onClick={e => onSectionSelect(sectionIndex, section.folder, e)}
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
              return this.renderSection(file, sectionIndex, fileIndex)
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
            {sidebar.map((section, sectionIndex) => {
              return this.renderMenu(section, sectionIndex)
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
