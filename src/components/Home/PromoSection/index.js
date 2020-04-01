import React from 'react'
import Link from '../../Link'

import { logEvent } from '../../../utils/ga'

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
          <Link
            href="/doc/tutorials/get-started"
            as={Button}
            first
            onClick={goToDocGetStarted}
          >
            Get Started
          </Link>
          <Link as={Button} href="/features" onClick={goToFeatures}>
            Full Features
          </Link>
        </Buttons>
        <Glyph src="/img/glyph-4.svg" gid={'rigthbottom'} />
      </Container>
    </Wrapper>
  )
}
