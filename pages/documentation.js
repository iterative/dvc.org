import React, { Component } from 'react'

import styled from 'styled-components'

import Page from '../src/Page'
import Hero from '../src/Hero'

export default () => (
  <Page stickHeader={true}>
    <Container>
      <Side>
        <Menu>
          <Heading>Documentation</Heading>
          menu
        </Menu>
      </Side>
      <Content>
        <Inner>inner</Inner>
      </Content>
    </Container>
  </Page>
)

const Container = styled.div`
  margin-top: 93px;
  display: flex;
  flex-direction: row;
  min-height: 80vh;
`

const Side = styled.div`
  flex-basis: 35.7%;
  display: flex;
  justify-content: flex-end;
  background-color: #eef4f8;
  padding-top: 32px;
`

const Menu = styled.div`
  width: 295px;
`

const Heading = styled.h3`
  font-size: 24px;
  color: #b0b8c5;
`

const Content = styled.div`
  flex: 1;

  padding-top: 69px;
  padding-left: 62px;
`

const Inner = styled.div`
  max-width: 615px;
`
