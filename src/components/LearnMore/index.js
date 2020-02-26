import React from 'react'
import { scroller } from 'react-scroll'

import { logEvent } from '../../utils/ga'

import { Wrapper, Icon, Caption } from './styles'

const scrollToDiagram = () => {
  logEvent('hero', 'learn-more')
  scroller.scrollTo('diagram-section', {
    duration: 800,
    offset: -75,
    delay: 0,
    smooth: 'easeInOut',
    containerId: 'bodybag'
  })
}

export default function LearnMore() {
  return (
    <Wrapper onClick={scrollToDiagram}>
      <Icon>
        <img src="/img/learn-more.svg" alt="Learn More" />
      </Icon>
      <Caption>Learn more</Caption>
    </Wrapper>
  )
}
