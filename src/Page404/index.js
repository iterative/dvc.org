import React, { Component } from 'react'
// styles
import styled from 'styled-components'

export default class Page404 extends Component {
  goBack = () => window.history.back()

  render() {
    return (
      <Wrapper>
        <StatusCode>404</StatusCode>
        <Message>Oops! Page Not Found!</Message>
        <Text>
          Sorry, but the page you are looking for is not found. Please, make
          sure you have typed the current URL.
        </Text>
        <GoBackLink onClick={this.goBack}>Go Back</GoBackLink>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  text-align: center;
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: 80vh;
  padding: 30px;
`

const StatusCode = styled.div`
  font-size: 120px;
  font-weight: 700;
  color: #13adc7;
`

const Message = styled.div`
  font-size: 36px;
  font-weight: 600;
`

const Text = styled.div`
  font-size: 18px;
`

const GoBackLink = styled.a`
  cursor: pointer;
  color: #13adc7;
  max-width: 100px;
  margin: 30px 0;
  font-size: 18px;
`
