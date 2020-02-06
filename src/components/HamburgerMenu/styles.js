import styled from 'styled-components'

import { media } from '../../styles'

export const Wrapper = styled.div`
  padding: 25px 15px 15px;
  display: none;
  position: fixed;
  z-index: 10;
  transform: translateX(100%);
  transition: transform 0.4s ease;
  will-change: transform;
  left: 0px;
  right: 0px;
  top: 0px;
  background-color: #40364d;
  color: #fff;

  ${media.phablet`
    display: block;
  `};

  ${props =>
    props.open &&
    `
    transform: translateX(0);
  `};
`

export const Button = styled.button`
  position: fixed;
  display: none;
  z-index: 999;

  right: 15px;
  top: 25px;
  padding: 0;
  border: none;
  background: transparent;

  ${media.phablet`
    display: block;
  `};
`

export const Menu = styled.div``

export const Image = styled.img`
  display: block;
  margin: 0 auto 5px;
`

export const ImageComment = styled.div`
  margin: 0 -30px;
  color: #fff;
  opacity: 0.5;
  line-height: 20px;
  text-align: center;
  white-space: nowrap;
`

export const ImageLink = styled.div`
  flex: 1 1 0;
  cursor: pointer;

  & + & {
    margin-left: 15px;
  }

  &:hover {
    opacity: 0.7;
  }
`

export const Section = styled.div`
  padding: 15px 0;

  & + & {
    border-top: 1px solid #4d465a;
  }
`

export const Subsection = styled.div`
  display: flex;
  margin-top: 15px;
`

export const Top = styled.div``

export const Logo = styled.a`
  display: block;
  width: 34px;
  margin-top: 5px;
`

export const Link = styled.a`
  font-family: BrandonGrotesqueBold;
  font-size: 13px;
  line-height: 20px;
  text-transform: uppercase;
  text-decoration: none;
  color: #fff;

  &:hover {
    opacity: 0.7;
  }
`

export const LinkButton = styled.a`
  display: block;
  margin-top: 15px;
  height: 38px;
  border-radius: 4px;
  background-color: #fff;
  font-family: BrandonGrotesqueMed;
  font-size: 16px;
  line-height: 38px;
  text-align: center;
  text-decoration: none;
  color: #24292e;

  &:hover {
    opacity: 0.7;
  }
`
