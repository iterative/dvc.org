import React from 'react'
import styled from 'styled-components'
import { media } from '../styles'

const popup = () => {
  showPopup()
}

const getStarted = () =>
  (window.location =
    'https://blog.dataversioncontrol.com/data-version-control-tutorial-9146715eda46')

export default ({ mobile = false }) => (
  <Nav mobile={mobile}>
    <Links>
      <Link href="/features">Features</Link>
      <Link href="/documentation">Documentation</Link>
      <Link href="https://github.com/iterative/dvc">Github</Link>
    </Links>
    <GetStartedButton onClick={this.getStarted}>Get Started</GetStartedButton>
  </Nav>
)

const Links = styled.div`
  display: flex;
  flex-direction: row;
`

const Link = styled.a`
  text-decoration: none;
  text-transform: uppercase;

  font-size: 13px;
  font-weight: bold;
  color: #838d93;

  margin-left: 30px;

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
  color: #fff;
  height: 36px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
`
