import styled from 'styled-components'
import { media } from '../../styles'

export const Wrapper = styled.div`
  position: relative;
  margin: 50px -50px;
  padding: ${({ hasBg }) => (hasBg ? '0 50px 260px' : '0 50px')};

  ${media.phablet`
    margin: 20px -5px;
    padding: 0 5px;
    background-position: top center;
    background-size: 550px 225px;
  `}
`

export const Header = styled.div`
  display: flex;
  color: ${({ color }) => color};

  ${media.tablet`
    margin: 0 10px;
  `}
`

export const Title = styled.div`
  font-size: 40px;
  font-family: BrandonGrotesqueMed;
  line-height: 60px;

  ${media.tablet`
    font-size: 34px;
    line-height: 40px;
  `}
`

export const Icon = styled.img`
  margin: -2px 0;

  ${media.tablet`
    display: none;
  `}
`

export const Description = styled.div`
  max-width: 600px;
  margin-top: 10px;
  font-size: 16px;
  line-height: 24px;
  color: #838d93;

  ${media.tablet`
    margin: 10px 10px 15px;
    font-size: 20px;
    line-height: 30px;
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

  ${media.phablet`
    position: relative;
    display: block;
    width: 550px;
    height: 225px;
    margin: 0 -275px 5px;
  `}
`

export const Content = styled.div``
