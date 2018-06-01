import React from 'react'
import styled from 'styled-components'
import { media, container } from '../styles'

export default ({}) => (
  <PromoSection>
    <Container>
      <Title>For data scientists, by data scientists</Title>
      <Buttons>
        <Button first>Get Started</Button>
        <Button>Full Features</Button>
      </Buttons>
    </Container>
  </PromoSection>
)

const PromoSection = styled.section`
  min-height: 278px;
  background-color: #945dd6;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Container = styled.div`
  ${container};
`

const Title = styled.h3`
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
`

const Buttons = styled.div`
  margin-top: 20px;
`

const Button = styled.button`
  min-width: 186px;
  height: 60px;
  border-radius: 4px;
  background-color: #945dd6;
  border: solid 2px rgba(255, 255, 255, 0.3);

  font-size: 20px;
  font-weight: 500;
  line-height: 0.9;

  color: #ffffff;

  ${props =>
    props.first &&
    `
    color: #945dd6;
    margin-right: 14px;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.21);
  `};
`
