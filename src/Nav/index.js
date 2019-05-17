import React from 'react'
import styled from 'styled-components'
import { media } from '../styles'
import { logEvent } from '../utils/ga'

const getStarted = () => {
  logEvent('menu', 'get-started')
  window.location = '/doc/get-started'
}

export default ({ mobile = false }) => (
  <Nav mobile={mobile}>
    <Links>
      <Link
        href="/features"
        onClick={() => {
          logEvent('menu', 'features')
        }}
      >
        Features
      </Link>
      <Link
        href="/doc"
        onClick={() => {
          logEvent('menu', 'doc')
        }}
      >
        Doc
      </Link>
      <Link
        href="/chat"
        onClick={() => {
          logEvent('menu', 'chat')
        }}
      >
        Chat
      </Link>
      <Link
        href="https://github.com/iterative/dvc"
        onClick={() => {
          logEvent('menu', 'github')
        }}
      >
        Github
      </Link>
      <Link
        href="/support"
        onClick={() => {
          logEvent('menu', 'support')
        }}
      >
        Support
      </Link>
    </Links>
    <GetStartedButton onClick={getStarted}>Get Started</GetStartedButton>
  </Nav>
)

const Links = styled.div`
  display: flex;
  flex-direction: row;
`

const Link = styled.a`
  text-decoration: none;
  text-transform: uppercase;

  font-family: BrandonGrotesqueBold, Tahoma, Arial;
  font-size: 13px;
  color: #838d93;
  padding-top: 10px;
  padding-bottom: 3px;
  border-bottom: 1.5px solid #fff;
  margin-left: 30px;

  &:hover {
    color: #40364d;
    border-bottom: 1.5px solid #40364d;
  }
`

const Nav = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;

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

const GetStartedButton = styled.button`
  text-decoration: none;
  margin-left: 40px;
  border-radius: 4px;
  background-color: #13adc7;
  font-family: BrandonGrotesqueMed, Tahoma, Arial;
  color: #fff;
  width: 113px;
  height: 38px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: 0.2s background-color ease-out;

  &:hover {
    background-color: #13a3bd;
  }
`
