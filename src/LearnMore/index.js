import React from 'react'
import styled, { keyframes } from 'styled-components'
import { media } from "../styles";

export default () => (
  <LearnMore href={'/#nextSlide'}>
    <Icon>
      <img src="/static/img/learn-more.svg" alt="Learn More" />
    </Icon>
    <Caption>Learn more</Caption>
  </LearnMore>
)

const LearnMore = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
`

export const bounce = keyframes`
  0%, 30%, 50%, 70%, 100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-25px);
  }

  60% {
    transform: translateY(-10px);
  }
`


const Icon = styled.div`
  width: 11px;
  height: 19px;
  will-change: transform;
  animation: ${bounce} 3s infinite;
  
  ${media.phone`animation: none;`};
  ${media.phablet`animation: none;`};
`


const Caption = styled.p`
  font-family: BrandonGrotesqueMed;
  line-height: 23px;
  font-size: 16px;
  font-weight: 500;
  color: #b0b8c5;
`
