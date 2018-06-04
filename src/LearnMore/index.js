import React from 'react'
import styled from 'styled-components'
import { container } from '../styles'

export default () => (
  <LearnMore>
    <Icon>
      <img src="/static/img/learn-more.svg" alt="Learn More" />
    </Icon>
    <Caption>Learn more</Caption>
  </LearnMore>
)

const LearnMore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Icon = styled.div`
  width: 11px;
  height: 19px;
`

const Caption = styled.p`
  line-height: 23px;
  font-size: 14px;
  font-weight: 500;
  color: #b0b8c5;
`
