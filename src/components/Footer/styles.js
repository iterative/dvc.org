import styled from 'styled-components'
import { columns, container, media } from '../../styles'

export const Wrapper = styled.section`
  min-height: 300px;
  background-color: #40364d;
  color: #fff;

  ${media.phablet`
    min-height: auto;
  `};
`

export const Container = styled.div`
  ${container};
  ${props => props.wide && `max-width: 1200px;`};
  padding-top: 64px !important;
  padding-bottom: 44px;

  ${media.tablet`
    padding: 64px 61px 44px 67px;
    max-width: auto;
  `}

  ${media.phablet`
    padding: 30px 25px;
    max-width: auto;
  `};
`

export const Top = styled.div`
  height: 40px;
  margin-bottom: 40.7px;
`

export const Logo = styled.a``

export const Columns = styled.div`
  ${columns};

  ${media.phablet`
    justify-content: space-between;
  `};
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 150px;
  margin-right: 66px;

  ${media.phablet`
    margin-right: 0px;
  `};
`

export const Heading = styled.h2`
  font-family: BrandonGrotesqueLight;
  opacity: 0.61;
  color: #ffffff;
  font-size: 20px;
  font-weight: 100;
`

export const Links = styled.div`
  margin-top: 29px;
  display: flex;
  flex-direction: column;
`

export const Link = styled.a`
  line-height: 23px;
  font-size: 20px;
  margin-bottom: 17px;
  display: flex;
  color: #fff;
  text-decoration: none;

  &:hover {
    color: #ccc;
  }

  ${props =>
    props.src &&
    `
    &::before {
      margin-right: 14px;
      width: 26px;
      height: 26px;
      content: ' ';
      display: block;
      background-image: url(${props.src});
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
    }
  `};
`

export const Copyright = styled.div`
  padding-bottom: 18px;
  padding-top: 18px;
  font-size: 14px;
`
