import React from 'react'
import styled from 'styled-components'
import { container } from '../styles'

export default ({ children }) => (
  <Hero>
    <Container>{children}</Container>
  </Hero>
)

const Hero = styled.section`
  position: relative;
  background-color: #eef4f8;
`

const Container = styled.div`
  ${container};
`
