import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const WIDTH = 30
const HEIGHT = 3

export default function Hamburger({ open }) {
  return (
    <Wrapper>
      <Line first open={open} />
      <Line second open={open} />
      <Line third open={open} />
    </Wrapper>
  )
}

Hamburger.propTypes = {
  open: PropTypes.bool
}

const Wrapper = styled.div`
  display: inline-block;
  cursor: pointer;
`

const Line = styled.div`
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  background-color: #173042;
  margin: 5px 0;
  transition: 0.4s;

  ${props =>
    props.open &&
    `
      background-color: #fff;
  `}

  ${props =>
    props.open &&
    props.first &&
    `
    transform: rotate(-45deg) translate(-7px, 6px);
  `};

  ${props =>
    props.open &&
    props.second &&
    `
    opacity: 0;
  `};

  ${props =>
    props.open &&
    props.third &&
    `
    
     transform: rotate(45deg) translate(-5px,-5px);
  `};
`
