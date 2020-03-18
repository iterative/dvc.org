import React from 'react'

import SubscribeForm from '../SubscribeForm'

import { Container, Glyph, SubscribeContainer, Title, Wrapper } from './styles'

export default function Subscribe() {
  return (
    <Wrapper>
      <Glyph src="/img/glyph-1.svg" gid={'topleft'} />
      <Container>
        <Title>Subscribe for updates. We won&#39;t spam you.</Title>
        <SubscribeContainer>
          <SubscribeForm />
        </SubscribeContainer>
      </Container>
      <Glyph src="/img/glyph-2.svg" gid={'rigthbottom'} />
    </Wrapper>
  )
}
