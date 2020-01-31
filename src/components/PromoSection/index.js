import React from 'react'
import Router from 'next/router'

import { logEvent } from '../../utils/ga'

import { PAGE_DOC } from '../../consts'

import { Button, Buttons, Container, Glyph, Title, Wrapper } from './styles'

function goToDocGetStarted() {
  logEvent('promo', 'get-started')

  Router.push({ pathname: '/doc/get-started', asPath: PAGE_DOC })
}

function goToFeatures() {
  logEvent('promo', 'features')

  Router.push('/features')
}

export default function PromoSection() {
  return (
    <Wrapper>
      <Container id="video">
        <Glyph src="/static/img/glyph-3.svg" gid={'topleft'} />
        <Title>For data scientists, by data scientists</Title>
        <Buttons>
          <Button first onClick={goToDocGetStarted}>
            Get Started
          </Button>
          <Button onClick={goToFeatures}>Full Features</Button>
        </Buttons>
        <Glyph src="/static/img/glyph-4.svg" gid={'rigthbottom'} />
      </Container>
    </Wrapper>
  )
}
