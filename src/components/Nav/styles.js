import styled from 'styled-components'

import { media } from '../../styles'

export const DropdownWrapper = styled.span`
  position: relative;
`

export const Dropdown = styled.div`
  display: none;
  position: absolute;
  z-index: 1;
  top: 30px;
  left: 23px;
  border-style: solid;
  border-width: 19px 10px 11px 37.5px;
  border-image-source: url(/img/community/menu.png);
  border-image-slice: 38 20 22 75;
  border-image-width: 19px 10px 11px 37.5px;
  border-image-repeat: repeat repeat;

  ${DropdownWrapper}:hover & {
    display: block;
  }
`

export const DropdownInset = styled.div`
  margin: -5px 0 -5px -9.5px;
  padding: 0 16px 0 0;
  background: #fff;
`

export const DropdownLink = styled.a`
  display: block;
  padding: 9px 0 13px;
  font-size: 18px;
  line-height: 27px;
  font-family: BrandonGrotesque, Tahoma, Arial;
  white-space: nowrap;
  text-decoration: none;
  color: #838d93;

  &:hover {
    opacity: 0.7;
  }

  & + & {
    border-top: 1px solid #e7e9ea;
  }
`

export const Links = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const Link = styled.a`
  text-decoration: none;
  text-transform: uppercase;

  display: block;
  font-family: BrandonGrotesqueBold, Tahoma, Arial;
  font-size: 13px;
  color: #838d93;
  padding-top: 10px;
  padding-bottom: 3px;
  border-bottom: 1.5px solid #fff;
  margin-left: 30px;

  &:hover {
    color: #40364d;
    border-bottom: 1.5px solid #40364d;
  }

  ${DropdownWrapper} &:hover {
    border-color: #fff;
  }
`

export const ImageLink = styled.a`
  display: block;
  margin-left: 30px;
  padding-top: 10px;

  & + & {
    margin-left: 10px;
  }

  &:hover {
    opacity: 0.7;
  }
`

export const Wrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;

  ${props =>
    props.mobile &&
    `
    display: none;
 `}

  ${media.phablet`
     ${props =>
       !props.mobile &&
       `
        display: none;
     `}
  `};
`

export const GetStartedButton = styled.a`
  box-sizing: border-box;

  width: 113px;
  height: 38px;
  margin-left: 30px;
  padding: 1px 7px 2px;
  border-radius: 4px;
  border: none;

  font-family: BrandonGrotesqueMed, Tahoma, Arial;
  font-size: 16px;
  line-height: 35px;
  text-decoration: none;
  text-align: center;
  color: #fff;

  background-color: #13adc7;
  transition: 0.2s background-color ease-out;

  &:hover {
    background-color: #13a3bd;
  }
`

export const Image = styled.img`
  width: 24px;
  height: 24px;
`
