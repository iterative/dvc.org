import React, { Fragment } from 'react'
import $ from 'jquery'

// components
import DownloadButton from '../../DownloadButton'
// styles
import styled from 'styled-components'
import { media, OnlyDesktop } from '../../styles'
import sidebar from "../sidebar";

export default class SidebarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      names:[],
      loading: true
    };
    this.collapse = this.collapse.bind(this);
    this.getName = this.getName.bind(this);
  }
  collapse() {
    setTimeout(function() {
      $('[data-open=true]').slideDown();
      $('[data-open=false]').slideUp()
    })
  }
  componentDidMount() {
    this.collapse();
    let arr = {},promises=[];
    sidebar.map(section=>{
      section.files.map(file=>{
        promises.push(new Promise((resolve) => {
          let result = {
            folder: file.folder ? file.folder : section.folder,
            filename: typeof file==='string'? file : file.indexFile,
            res: null
          };
          fetch(`${result.folder}/${result.filename}`).then(function(response) {
            response.text().then(text => {
              result.res = text.substring(2,text.search(/\n/));
              resolve(result);
            })
          }).catch(function(error) {
          });
        }));
        if (file.files && file.files.length>0){
          file.files.map(file2=>{
            promises.push(new Promise((resolve) => {
              let result = {
                folder: file.folder ? file.folder : section.folder,
                filename: file2,
                res: null
              };
              fetch(`${result.folder}/${result.filename}`).then(function(response) {
                response.text().then(text => {
                  result.res = text.substring(2,text.search(/\n/));
                  resolve(result);
                })
              }).catch(function(error) {
              });
            }));
          });
        }
      })
    });
    Promise.all(promises).then(result=>{
        result.map(res=>{
          arr[res.folder+'/'+res.filename]=res.res;
        })
    });
    this.setState({
      names:arr,
      loading: false
    });
  }
  getName(labels=null,files=null,folder=null,indexFile=null, name=null){
    return labels && labels[indexFile] ? labels[indexFile] : this.state.names[folder+'/'+indexFile];
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentSection !== this.props.currentSection ||
      nextProps.currentFile !== this.props.currentFile
    ) {
      this.collapse()
    }
  }
  render() {
    function includes(array, value, folder) {
      let flag = false;
      array.map(elem=>{
        if(folder+'/'+elem===value){
          flag = true;
        }
      });
      return flag;
    }
    const {
      sidebar,
      currentSection,
      currentFile,
      onSectionSelect,
      onFileSelect,
      getLinkHref
    } = this.props

    return !this.state.loading ? (
      <Menu id="sidebar-menu">
        <Sections>
          <SectionLinks>
            {sidebar.map((section, index) =>
              {
                const isSectionActive = currentSection === index;
                let sectionTitle = section.name ? section.name : this.getName(section.labels,section.files,section.folder,section.indexFilefile)
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
                    {/* Section Files */}
                    <Collapse data-open={isSectionActive ? 'true' : 'false'}>
                      {section.files && section.files.map((file, fileIndex) => {
                        const subgroup = file.files ? file.files : null;
                        let compare = (file.folder && file.indexFile) ? file.folder+'/'+file.indexFile : section.folder+'/'+file;
                        const isFileActive = currentFile === compare;
                        let FileOrSubsectionTitle = file.name ? file.name : this.getName(section.labels,section.files,file.folder ? file.folder : section.folder,file.indexFile ? file.indexFile : file);
                        return (
                          <Fragment key={`file-${fileIndex}`}>
                            <div>
                              <SectionLink
                                level={2}
                                href={getLinkHref(index, file.indexFile)}
                                onClick={e => onFileSelect(file, index, e)}
                                isActive={isFileActive}
                              >
                                {FileOrSubsectionTitle}
                              </SectionLink>
                            </div>
                            {/*Subgroup files*/}
                            {subgroup && (
                              <Collapse data-flag={'first'} data-open={(isFileActive || includes(subgroup, currentFile, file.folder ? file.folder : section.folder))? 'true' : 'false'}>
                                {subgroup.map((file2, subIndex) => {
                                  let compare = (file.folder ? file.folder : section.folder)+'/'+file2;
                                  console.log(compare);
                                  return (
                                    <div key={`file-${fileIndex}-${subIndex}`}>
                                      <SectionLink
                                        level={3}
                                        href={getLinkHref(index, file2, fileIndex)}
                                        onClick={e => onFileSelect(file2, index, e, fileIndex)}
                                        isActive={currentFile === compare}
                                      >
                                        {this.getName(file.labels,file.files,file.folder ? file.folder : section.folder,file2)}
                                      </SectionLink>
                                    </div>
                                  )
                                })}
                              </Collapse>
                            )}
                          </Fragment>
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
    ):(
      <Menu id="sidebar-menu">
        <p>loading</p>
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
