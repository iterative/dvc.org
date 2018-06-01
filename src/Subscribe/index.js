import React from 'react'
import styled from 'styled-components'
import { media, container } from '../styles'

export default ({}) => (
  <Subscribe>
    <Container>
	    <h3>Subscribe for updates. We wont spam you.</h3>
    </Container>
  </Subscribe>
)

const Subscribe = styled.section`
  min-height: 300px;
  background-color: #13adc7;
`

const Container = styled.div`
	${container}
`