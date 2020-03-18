import React from 'react'
import PropTypes from 'prop-types'

import LocalLink from '../LocalLink'

import { Button, Buttons, Container, Glyph, Title, Wrapper } from './styles'

export default function TrySection({ title, buttonText = 'Get Started' }) {
  return (
    <Wrapper>
      <Container>
        <Glyph src="/img/glyph-3.svg" gid={'topleft'} />
        <Title>{title}</Title>
        <Buttons>
          <LocalLink href="/doc/get-started" as={Button} first="true">
            {buttonText}
          </LocalLink>
        </Buttons>
        <Glyph src="/img/glyph-4.svg" gid={'rigthbottom'} />
      </Container>
    </Wrapper>
  )
}

TrySection.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string
}
