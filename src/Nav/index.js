import React from 'react'
import styled from 'styled-components'
import { media } from '../styles'

const popup = () => {
  showPopup()
}

export default ({ mobile = false }) => (
  <Nav mobile={mobile}>
    <Links>
      <Link href="/features">Features</Link>
      <Link href="/features">Documentation</Link>
	    <Link href="https://github.com/iterative">Github</Link>
    </Links>
  </Nav>
)

const Links = styled.div`
  display: flex;
  flex-direction: row;
`

const Link = styled.a`
  text-decoration: none;
  margin-left: 30px;
  font-size: 13px;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
  border-bottom: 1px solid transparent;

  &:hover {
    text-decoration: none;
    border-bottom-color: #fff;
  }

  ${props =>
    props.bold &&
    `
    font-weight: bold;
  `};
`

const Button = styled.button`
  width: 151px;
  height: 36px;
  border-radius: 4px;
  background-image: linear-gradient(to top, #26b077, #50eb5a);
  margin-left: 35px;
  padding-left: 3px;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
`

const Nav = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 31px;

  ${props =>
    props.mobile &&
    `
    display: none;
 `} ${media.phablet` 
     ${props =>
       !props.mobile &&
       `
        display: none;
     `} 
  `};
`
