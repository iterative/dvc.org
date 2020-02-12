import styled from 'styled-components'

import { media } from '../../styles'

export const Wrapper = styled.div`
  padding: 25px 31px 20px 31px;
  display: none;
  position: fixed;
  z-index: 10;
  transform: translateX(100%);
  transition: transform 0.4s ease;
  will-change: transform;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
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

  width: 46px;
  height: 36px;

  border: none;
  background: transparent;

  ${media.phablet`
    display: block;
  `};
`

export const Menu = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
`

export const Section = styled.div``

export const Top = styled.div`
  height: 40px;
  margin-bottom: 40.7px;
`

export const Logo = styled.a`
  margin-top: 5px;
  display: block;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  transform: translate3d(0, 0, 0);
`

export const Columns = styled.div`
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  flex-basis: 50%;
`

export const Links = styled.div`
  display: flex;
  flex-direction: column;
`

export const Heading = styled.h2`
  opacity: 0.61;
  color: #fff;
  font-size: 20px;
  font-weight: 100;
`

export const Link = styled.a`
  font-size: 18px;
  padding: 8px 0px;
  display: flex;
  color: #fff;
  text-decoration: none;

  &:hover {
    color: #fff;
  }

  ${props =>
    props.src &&
    `
    &::before {
      margin-right: 14px;
      width: 26px;
      height: 26px;
      content: '';
      background-image: url(${props.src});
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
    }
  `};
`
