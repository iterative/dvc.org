import React from 'react'
import LocalLink from '../LocalLink'

import { logEvent } from '../../utils/ga'

import { Button, Buttons, Container, Glyph, Title, Wrapper } from './styles'

const goToDocGetStarted = () => logEvent('promo', 'get-started')
const goToFeatures = () => logEvent('promo', 'features')

export default function PromoSection() {
  return (
    <Wrapper>
      <Container id="video">
        <Glyph src="/img/glyph-3.svg" gid={'topleft'} />
        <Title>For data scientists, by data scientists</Title>
        <Buttons>
          <LocalLink
            href="/doc/get-started"
            as={Button}
            first
            onClick={goToDocGetStarted}
          >
            Get Started
          </LocalLink>
          <LocalLink as={Button} href="/features" onClick={goToFeatures}>
            Full Features
          </LocalLink>
        </Buttons>
        <Glyph src="/img/glyph-4.svg" gid={'rigthbottom'} />
      </Container>
    </Wrapper>
  )
}
