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
    line-height: 60px;

    &::after {
      content: '';

      position: relative;
      display: inline-block;
      width: 0;
      height: 0;
      margin-left: 10px;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      ${({ isContentVisible }) =>
        isContentVisible
          ? `
          border-bottom: 12px solid currentColor;
          
         `
          : `
          border-top: 12px solid currentColor;
      `}
      
    }
  `}
`

export const Icon = styled.img`
  margin: -2px 0;

  ${media.tablet`
    margin: -2px -5px -12px auto;
    width: 72px;
    height: 72px;
  `}
`

export const Description = styled.div`
  max-width: 600px;
  margin-top: 10px;
  font-size: 16px;
  line-height: 24px;
  color: #838d93;

  ${media.tablet`
    display: none;
  `};
`

export const MobileDescription = styled.div`
  display: none;
  margin: 0 0 25px;
  font-size: 18px;
  line-height: 30px;
  color: #838d93;

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

export const Content = styled.div`
  ${media.tablet`
    display: ${({ isContentVisible }) => (isContentVisible ? 'block' : 'none')}
  `}
`
