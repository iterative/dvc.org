import React from 'react'
import styled from 'styled-components'

export default function FeaturesHero() {
  return (
    <Wrapper>
      <Heading>
        DVC brings agility, reproducibility, and collaboration into your
        existing data science workflow
      </Heading>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding-top: 87px;
  padding-bottom: 58px;
  overflow: hidden;
`

const Heading = styled.h1`
  font-family: BrandonGrotesqueMed;
  margin: 0px auto;
  max-width: 610px;
  min-height: 185px;
  font-size: 40px;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
  color: #40364d;
`
