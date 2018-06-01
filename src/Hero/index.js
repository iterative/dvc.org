import React from 'react'
import styled from 'styled-components'
import { media, container } from '../styles'

export default ({}) => (
  <Hero>
    <Container>
			hero
    </Container>
  </Hero>
)

const Hero = styled.div`
	min-height: 624px;
  background-color: #eef4f8;
  margin-top: 76px;
`

const Container = styled.div`
	${container}
`