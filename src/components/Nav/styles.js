import styled from 'styled-components'

import { media } from '../../styles'

export const Links = styled.div`
  display: flex;
  flex-direction: row;
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
  margin-left: 40px;
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

export const DropdownWrapper = styled.span`
  position: relative;
`

export const Dropdown = styled.div`
  display: none;
  position: absolute;
  top: 29px;
  left: 30px;
  border-radius: 5px;
  padding: 0 20px;
  background: #222934;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.18);

  ${DropdownWrapper}:hover & {
    display: block;
  }
`

export const DropdownLink = styled.a`
  display: block;
  padding: 10px 0;
  font-size: 18px;
  line-height: 29px;
  font-family: BrandonGrotesque, Tahoma, Arial;
  white-space: nowrap;
  text-decoration: none;
  color: #fff;

  &:hover {
    opacity: 0.75;
  }

  & + & {
    border-top: 1px solid #333a44;
  }
`
