import React from 'react'
import styled from 'styled-components'
import { media } from '../styles'

const getStarted = () => {
  window.location =
    'https://blog.dataversioncontrol.com/data-version-control-tutorial-9146715eda46'
}

const features = () => {
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
  position: relative;
  height: 278px;
  background-color: #945dd6;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Container = styled.div`
  width: 100%;
  max-width: 1035px;
`

const Title = styled.h3`
  font-family: BrandonGrotesqueMed;
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
  font-family: BrandonGrotesqueMed;
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
  
  &:hover {
    background-color: #885CCB
  }

  ${props =>
    props.first &&
    `
    color: #945dd6;
    margin-right: 14px;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.21);
    
    background-image: url('/static/img/arrow_right_dark.svg');
    
    &:hover {
      background-color: #F5F5F5
    }
    
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
  z-index: 0;
  width: 158px;
  height: auto;

  ${media.tablet`
    width: 110px;
  `};

  object-fit: contain;

  ${props =>
    props.gid === 'topleft' &&
    `
		top: -25px;
		left: 40px;
	`} ${props =>
    props.gid === 'rigthbottom' &&
    `
    bottom: -60px;
    right: 30px;
	`};

  ${media.phablet`
	  display: none;
	`};
`
