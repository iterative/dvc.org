import styled from 'styled-components'
import { media } from '../../src/styles'

export const GithubLink = styled.a`
  display: none;
  float: right;
  margin: 5px 0 10px 10px;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  color: #242A31 !important;
  background-color: #FFFFFF;
  border: 1px solid #D3DCE4;
  
  line-height: 30px;
  padding: 2px 16px;
  border-radius: 3px;
  cursor: pointer;
  transition: 0.2s background-color ease-out;
  position: relative
  z-index: 1

  ${media.tablet`
    float: none;
    margin: 0 0 15px 0;
  `};

  @media only screen and (max-width: 1170px) {
    display: inline-flex;
  }

  &:hover {
    background-color: #F5F7F9;
  }

  i {
    background-image: url(/static/img/github_icon.svg);
    background-size: contain;
    width: 1em;
    height: 1em;
    margin-right: 7px;
  }
`
