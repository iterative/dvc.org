import styled from 'styled-components'
import { media } from '../../styles'

export const Wrapper = styled.div`
  position: relative;
  margin: 50px -50px;
  padding: ${({ hasBg }) => (hasBg ? '0 50px 260px' : '0 50px')};

  ${media.tablet`
    margin: 20px 0;
    padding: 0;
  `}
`

export const Header = styled.div`
  display: flex;
  color: ${({ color }) => color};
`

export const Title = styled.div`
  font-size: 40px;
  font-family: BrandonGrotesqueMed;
  line-height: 60px;

  ${media.tablet`
    font-size: 30px;
    line-height: 35px;
    cursor: pointer;

    &::after {
      content: '';

      position: relative;
      display: inline-block;
      width: 0;
      height: 0;
      margin-left: 10px;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 12px solid currentColor;
      transition: transform 200ms;

      ${({ isContentVisible }) =>
        isContentVisible &&
        `transform: rotate(-180deg)
      `}
      
    }
  `}
`

export const Icon = styled.img`
  width: 50px;
  height: 50px;
  margin: 5px 10px 0 0;
`

const Description = styled.div`
  max-width: 600px;
  font-size: 16px;
  line-height: 24px;
  color: #838d93;

  ${media.tablet`
    display: none;
  `};
`

export const DesktopDescription = styled(Description)`
  max-width: 600px;

  ${media.tablet`
    display: none;
  `};
`

export const MobileDescription = styled(Description)`
  display: none;

  ${media.tablet`
    display: block;
  `};
`

export const Picture = styled.img`
  z-index: -1;
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 1100px;
  height: 450px;
  margin-left: -550px;

  ${media.tablet`
    display: none;
  `}
`
