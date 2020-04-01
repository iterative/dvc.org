import React from 'react'
import PropTypes from 'prop-types'

import { Container, Wrapper } from './styles'

export default function HeroSection({ children }) {
  return (
    <Wrapper>
      <Container>{children}</Container>
    </Wrapper>
  )
}

HeroSection.propTypes = {
  children: PropTypes.node.isRequired
}
