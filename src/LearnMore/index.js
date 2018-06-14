import React from 'react'
import styled from 'styled-components'

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

const Icon = styled.div`
  width: 11px;
  height: 19px;
`

const Caption = styled.p`
  font-family: BrandonGrotesqueMed;
  line-height: 23px;
  font-size: 16px;
  font-weight: 500;
  color: #b0b8c5;
`
