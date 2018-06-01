import React from 'react'
import styled from 'styled-components'
import { media, container } from '../styles'

export default ({}) => (
  <Diagram>
    <Container>
	    Diagram
    </Container>
  </Diagram>
)

const Diagram = styled.section`
  padding-top: 80px;
  padding-bottom: 91px;
`

const Container = styled.div`
	${container}
`