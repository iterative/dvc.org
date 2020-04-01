import styled, { keyframes } from 'styled-components'

import { media } from '../../../styles'

export const Wrapper = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
`

export const bounce = keyframes`
  0%, 30%, 45%, 65%, 100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-13px);
  }

  60% {
    transform: translateY(-5px);
  }
`

export const bounceMobile = keyframes`
  0%, 30%, 50%, 70%, 100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-13px);
  }

  60% {
    transform: translateY(-5px);
  }
`

export const Icon = styled.div`
  width: 11px;
  height: 19px;
  will-change: transform;
  animation: ${bounce} 3s infinite;

  ${media.phone`animation: ${bounceMobile} 3s infinite;`};
  ${media.phablet`animation: ${bounceMobile} 3s infinite;`};
`

export const Caption = styled.p`
  font-family: BrandonGrotesque;
  line-height: 23px;
  font-size: 16px;
  font-weight: 500;
  color: #b0b8c5;
  display: initial;
  ${media.giant`display: initial;`};
  ${media.desktop`display: initial;`};
  ${media.tablet`display: initial;`};
  ${media.phablet`display: none;`};
  ${media.phone`display: none;`};
`
