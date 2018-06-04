import React from 'react'
import styled from 'styled-components'
import { media, container } from '../styles'

import SubscribeForm from '../SubscribeForm'

export default ({}) => (
  <Subscribe>
	  <Container>
	    <Glyph src="/static/img/glyph-1.svg" gid={'topleft'}/>
	    <Title>Subscribe for updates. We wont spam you.</Title>
	    <SubscribeContainer>
		    <SubscribeForm />
	    </SubscribeContainer>
	    <Glyph src="/static/img/glyph-2.svg" gid={'rigthbottom'}/>
    </Container>
  </Subscribe>
)

const Subscribe = styled.section`
  min-height: 300px;
  background-color: #13ADC7;

	${media.phablet`
    display: flex;
    align-items: center;
	`}
	
	 @media only screen and (orientation: landscape) {
			display: flex;
			align-items: center;
	 }
`

const Container = styled.div`
	${container};
  position: relative;
	padding-top: 90px;
	
	${media.phablet`
    padding: 0px 10px;
	`}
`

const Glyph = styled.img`
	position: absolute;
	z-index: 9;
	
  width: 158px;
  height: 192px;
  
  object-fit: contain;
	
	${props => props.gid === 'topleft' && `
		top: -32px;
		left: -158px;
	`}
	
	${props => props.gid === 'rigthbottom' && `
    bottom: -154px;
    right: -158px;
	`}
	
	${media.phablet`
	  display: none;
	`}
`


const Title = styled.h3`
	min-width: 550px;
  min-height: 44px;
  font-size: 30px;
  font-weight: 500;
  color: #ffffff;
	margin: 0px auto;
	text-align: center;
	
	${media.phablet`
		min-width: auto;
	`}
`

const SubscribeContainer = styled.div`
	margin: 0px auto;
	margin-top: 15px;
	max-width: 510px;
  height: 60px;
  border-radius: 8px;
  background-color: #ffffff;
`