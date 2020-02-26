import styled from 'styled-components'

import { media } from '../../../styles'

export const Menu = styled.div`
  position: sticky;
  top: 60px;
  height: calc(100vh - 138px);
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;

  .ReactCollapse--collapse {
    padding-left: 20px;
    transition: height 250ms;
  }

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

export const Sections = styled.div`
  margin-bottom: 25px;
  margin-top: 10px;
  min-width: 280px;

  ${media.phablet`
    min-width: auto;
  `}
`

export const SectionLinks = styled.div`
  @media (max-width: 768px) {
    position: relative;
  }
`

const sectionLinkColor = '#b0b8c5'

export const SectionLink = styled.a`
  display: block;
  position: relative;
  font-size: 18px;
  font-weight: 500;
  color: #b0b8c5;
  color: ${sectionLinkColor};
  text-decoration: none;
  font-weight: 400;
  line-height: 26px;
  min-height: 26px;
  padding-bottom: 5px;
  padding-left: 15px;
  margin: 0 0 0 5px;

  ${props =>
    props.isActive &&
    `
    color: #40364d;
  `};

  &:hover {
    color: #3c3937;

    ${media.phablet`
      color: ${sectionLinkColor};
    `}
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 8px;
    height: 5px;
    background: url('/img/triangle_dark.svg') no-repeat center center;
    left: 0px;
    top: 10px;

    ${props =>
      props.isActive &&
      `
      transform: rotate(-90deg);
    `};
  }
`

export const SideFooter = styled.div`
  margin-top: 30px;
  padding-bottom: 30px;
`
