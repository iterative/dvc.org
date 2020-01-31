import React from 'react'
import PropTypes from 'prop-types'

import { Container, Wrapper } from './styles'

export default function Hero({ children }) {
  return (
    <Wrapper>
      <Container>{children}</Container>
    </Wrapper>
  )
}

Hero.propTypes = {
  children: PropTypes.node.isRequired
}
