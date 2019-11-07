import React from 'react'
import styled from 'styled-components'
import { media } from '../styles'

import SubscribeForm from '../SubscribeForm'

export default function Subscribe() {
  return (
    <Wrapper>
      <Glyph src="/static/img/glyph-1.svg" gid={'topleft'} />
      <Container>
        <Title>Subscribe for updates. We won&#39;t spam you.</Title>
        <SubscribeContainer>
          <SubscribeForm />
        </SubscribeContainer>
      </Container>
      <Glyph src="/static/img/glyph-2.svg" gid={'rigthbottom'} />
    </Wrapper>
  )
}

const Wrapper = styled.section`
  position: relative;
  height: 300px;
  background-color: #13adc7;

  ${media.phablet`
    display: flex;
    align-items: center;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    display: flex;
    align-items: center;
  }
`

const Glyph = styled.img`
  position: absolute;
  z-index: 0;

  width: 158px;
  height: auto;

  object-fit: contain;

  ${media.tablet`
    width: 110px;
  `};

  ${props =>
    props.gid === 'topleft' &&
    `
    top: -32px;
    left: 28px;
  `}

  ${props =>
    props.gid === 'rigthbottom' &&
    `
    bottom: -60px;
    right: 28px;
  `}

  ${media.phablet`
    display: none;
  `}
`

const Container = styled.div`
  width: 100%;
  margin: 0px auto;
  max-width: 1035px;
  padding-top: 90px;

  ${media.phablet`
    padding: 0px 10px;
  `};

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    padding: 0px 10px;
  }
`

const Title = styled.h3`
  font-family: BrandonGrotesqueMed;
  min-width: 550px;
  min-height: 44px;
  font-size: 30px;
  font-weight: 500;
  color: #ffffff;
  margin: 0px auto;
  text-align: center;

  ${media.phablet`
    min-width: auto;
  `};
`

const SubscribeContainer = styled.div`
  margin: 0px auto;
  margin-top: 15px;
  max-width: 510px;
  border-radius: 8px;
  background-color: #ffffff;

  ${media.phablet`
    width: 100%;
    margin: 0px auto;
    margin-top: 40px;
    min-height: auto;
  `} @media only screen
  and (min-device-width : 768px)
  and (max-device-width : 1024px) {
    width: 100%;
    margin: 0px auto;
    margin-top: 40px;
    min-height: auto;
  }
`
