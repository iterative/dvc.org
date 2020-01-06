import PropTypes from 'prop-types'
import React from 'react'
import { container } from '../styles'
import styled from 'styled-components'

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

const Wrapper = styled.section`
  position: relative;
  background-color: #eef4f8;
`

const Container = styled.div`
  ${container};
`
