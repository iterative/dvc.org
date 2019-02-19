import React from 'react'
// components
import DownloadButton from '../../DownloadButton'
// utils
import startCase from 'lodash.startcase'
// styles
import styled from 'styled-components'
import { media, OnlyDesktop } from '../../styles'

export default class SidebarMenu extends React.Component {
  renderFileHeadings = isOpen => {
    const { headings, scrollToLink } = this.props

    return (
      <Collapse isOpen={isOpen} items={headings.length}>
        {!!headings.length &&
          headings.map(({ text, slug }, headingIndex) => (
            <SectionLink
              level={3}
              key={`link-${headingIndex}`}
              onClick={() => scrollToLink('#' + slug)}
              href={`#${slug}`}
            >
              {text}
            </SectionLink>
          ))}
      </Collapse>
    )
  }

  render() {
    const {
      sidebar,
      currentSection,
      currentFile,
      headings,
      onSectionSelect,
      getLinkHref
    } = this.props

    return (
      <Menu id="sidebar-menu">
        <Sections>
          <SectionLinks>
            {sidebar.map(
              ({ name, files = [], labels = {}, indexFile }, index) => {
                const isSectionActive = currentSection === index
                return (
                  <div key={index}>
                    <SectionLink
                      level={1}
                      href={getLinkHref(
                        index,
                        indexFile ? undefined : files[0]
                      )}
                      onClick={e => onSectionSelect(index, e)}
                      className={isSectionActive ? 'docSearch-lvl0' : ''}
                      isActive={isSectionActive}
                    >
                      {name}
                    </SectionLink>

                    {/* Section Files */}
                    <Collapse
                      isOpen={isSectionActive}
                      items={files.length + headings.length}
                    >
                      {files &&
                        files.map((file, fileIndex) => {
                          const isFileActive = currentFile === file
                          return (
                            <div key={`file-${fileIndex}`}>
                              <SectionLink
                                level={2}
                                href={getLinkHref(index, file)}
                                onClick={e => onFileSelect(file, index, e)}
                                isActive={isFileActive}
                              >
                                {labels[file] || startCase(file.slice(0, -3))}
                              </SectionLink>

                              {this.renderFileHeadings(isFileActive)}
                            </div>
                          )
                        })}
                    </Collapse>
                  </div>
                )
              }
            )}
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
      margin-left: 50px;

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
  height: 0;
  overflow: hidden;
  height: ${({ isOpen, items }) => (isOpen ? items * 31 : 0)}px;
  transition: height 0.3s linear;
`

const SideFooter = styled.div`
  margin-top: 30px;
  padding-bottom: 30px;
`
