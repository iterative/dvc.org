import React from 'react'
import styled from 'styled-components'
import { media, container } from '../styles'
import Router from 'next/router'

const getStarted = () => {
  window.scrollTo(0, 0)
  window.location =
    'https://blog.dataversioncontrol.com/data-version-control-tutorial-9146715eda46'
}

const features = () => {
  window.scrollTo(0, 0)
  window.location = '/features'
}

export default ({}) => (
  <PromoSection>
    <a name="video" />
    <Container>
      <Glyph src="/static/img/glyph-3.svg" gid={'topleft'} />
      <Title>For data scientists, by data scientists</Title>
      <Buttons>
        <Button first onClick={() => getStarted()}>
          Get Started
        </Button>
        <Button onClick={() => features()}>Full Features</Button>
      </Buttons>
      <Glyph src="/static/img/glyph-4.svg" gid={'rigthbottom'} />
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
  position: relative;
  width: 100%;
`

const Title = styled.h3`
  max-width: 438px;
  min-height: 44px;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
  margin: 0px auto;
`

const Buttons = styled.div`
  display: flex;
  max-width: 386px;
  margin: 0px auto;
  margin-top: 20px;
  align-items: center;
  flex-direction: row;
  ${media.phablet`
    flex-direction: column;
  `};
`

const Button = styled.button`
  cursor: pointer;
  min-width: 186px;
  height: 60px;
  border-radius: 4px;
  background-color: #945dd6;
  border: solid 2px rgba(255, 255, 255, 0.3);

  font-size: 20px;
  font-weight: 500;
  line-height: 0.9;

  text-align: left;
  padding: 0px 21px;

  color: #ffffff;

  background: url('/static/img/arrow_right_white.svg') right center no-repeat;
  background-position-x: 147px;

  ${props =>
    props.first &&
    `
    color: #945dd6;
    margin-right: 14px;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.21);
    
    background-image: url('/static/img/arrow_right_dark.svg');
    
     ${media.phablet`
      margin-right: 0px;
   `}
  `};

  ${media.phablet`
    margin-bottom: 12px;
    margin-right: 0px !important;
  `};
`

const Glyph = styled.img`
  position: absolute;
  z-index: 9;

  width: 158px;
  height: 192px;

  object-fit: contain;

  ${props =>
    props.gid === 'topleft' &&
    `
		top: -102px;
		left: -158px;
	`} ${props =>
    props.gid === 'rigthbottom' &&
    `
    bottom: -144px;
    right: -158px;
	`};

  ${media.phablet`
	  display: none;
	`};
`
