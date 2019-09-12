import React from 'react'
import styled, { keyframes } from 'styled-components'

// Based on https://codepen.io/Beaugust/pen/DByiE?editors=0100#0

export const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

const Wrapper = styled.div`
  flex-grow: 1;
  text-align: center;
  padding-top: 10vw;
  color: #24292e;
`

const Container = styled.div`
  position: relative;
  display: inline-block;
  box-sizing: border-box;
`

const Circle = styled.div`
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  border-radius: 100%;
  border: 10px solid rgb(36, 41, 46, 0.2);
  border-top-color: currentColor;
  animation: ${spin} 1s infinite linear;
`

const Text = styled.div`
  font-size: 16px;
  line-height: 1.5;
`

export default function Loader() {
  return (
    <Wrapper>
      <Container>
        <Circle />
      </Container>
      <Text>Loading...</Text>
    </Wrapper>
  )
}
