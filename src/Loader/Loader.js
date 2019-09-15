import React from 'react'
import styled, { keyframes } from 'styled-components'

// Based on https://codepen.io/Beaugust/pen/DByiE?editors=0100#0

export const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

const Container = styled.div`
  position: relative;
  display: flex;
  align-self: stretch;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #24292e;
`

const Circle = styled.div`
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  border: 5px solid rgb(36, 41, 46, 0.2);
  border-top-color: currentColor;
  animation: ${spin} 1s infinite linear;
`

export default function Loader() {
  return (
    <Container>
      <Circle />
    </Container>
  )
}
