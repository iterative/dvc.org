import React from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'

import { Button, Buttons, Container, Glyph, Title, Wrapper } from './styles'

export default function TrySection({ title, buttonText = 'Get Started' }) {
  return (
    <Wrapper>
      <Container>
        <Glyph src="/static/img/glyph-3.svg" gid={'topleft'} />
        <Title>{title}</Title>
        <Buttons>
          <NextLink href="/doc" as="/doc/get-started">
            <Button first>{buttonText}</Button>
          </NextLink>
        </Buttons>
        <Glyph src="/static/img/glyph-4.svg" gid={'rigthbottom'} />
      </Container>
    </Wrapper>
  )
}

TrySection.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string
}
