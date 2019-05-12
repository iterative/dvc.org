import React from 'react'
import styled from 'styled-components'

import { media, container } from '../styles'

export default ({ title, buttonText = 'Get Started' }) => (
  <TrySection>
    <Container>
      <Glyph src="/static/img/glyph-3.svg" gid={'topleft'} />
      <Title>{title}</Title>
      <Buttons>
        <a href="/doc/get-started">
          <Button first>{buttonText}</Button>
        </a>
      </Buttons>
      <Glyph src="/static/img/glyph-4.svg" gid={'rigthbottom'} />
    </Container>
  </TrySection>
)

const TrySection = styled.section`
  position: relative;
  height: 278px;
  background-color: #945dd6;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Container = styled.div`
  ${container};
  width: 100%;
`

const Title = styled.h3`
  font-family: BrandonGrotesqueMed;
  max-width: 600px;
  min-height: 44px;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
  margin: 0px auto;
`

const Buttons = styled.div`
  max-width: 386px;
  margin: 0px auto;
  margin-top: 20px;
  align-items: center;
  display: flex;
  justify-content: center;
`

const Button = styled.button`
  font-family: BrandonGrotesqueMed;
  min-width: 186px;
  height: 60px;
  border-radius: 4px;
  background-color: #945dd6;
  border: solid 2px rgba(255, 255, 255, 0.3);

  font-size: 20px;
  line-height: 0.9;

  text-align: left;
  padding: 0px 50px 0 20px;

  color: #ffffff;
  transition: 0.2s background-color ease-out;

  &:hover {
    background-color: #f5f5f5;
  }

  background: url('/static/img/arrow_right_white.svg') right center no-repeat;
  background-position-x: calc(100% - 15px);

  cursor: pointer;

  ${props =>
    props.first &&
    `
    color: #945dd6;
    margin-right: 14px;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.21);
    
    background-image: url('/static/img/arrow_right_dark.svg');
  `};
`

const Glyph = styled.img`
  position: absolute;
  z-index: 0;

  width: 158px;
  height: 192px;

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
