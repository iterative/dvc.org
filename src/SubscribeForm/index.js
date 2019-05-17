import React from 'react'
import styled from 'styled-components'
import { media } from '../styles'

export default () => (
  <Form
    action="https://sweedom.us10.list-manage.com/subscribe/post?u=a08bf93caae4063c4e6a351f6&amp;id=24c0ecc49a"
    method="post"
    id="mc-embedded-subscribe-form"
    name="mc-embedded-subscribe-form"
    class="validate"
    target="_blank"
    novalidate
  >
    <Input
      type="email"
      name="EMAIL"
      class="email"
      id="mce-EMAIL"
      placeholder="email address"
      required
    />

    {/*real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
    <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
      <input
        type="text"
        name="b_a08bf93caae4063c4e6a351f6_24c0ecc49a"
        tabIndex="-1"
        value=""
      />
    </div>

    <Button type="submit" name="subscribe" id="mc-embedded-subscribe">
      Subscribe
    </Button>
  </Form>
)

const Form = styled.form`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: #ffffff;
  display: flex;

  ${media.phablet`
    flex-direction: column;
  `};
`

const Input = styled.input`
  font-family: BrandonGrotesqueMed;
  display: flex;
  flex: 1;
  padding: 16px
  border: none;
  border-radius: 8px 0px 0px 8px;
  font-size: 20px;
  font-weight: 500;
  
  ${media.phablet`
    border-radius: 4px 4px 0px 0px;
  `};
  
`

const Button = styled.button`
  font-family: BrandonGrotesqueMed;
  width: 115px;
  border: none;
  border-radius: 0px 8px 8px 0px;
  background-color: #e4fbff;
  font-size: 20px;
  font-weight: 500;
  color: #13adc7;
  cursor: pointer;

  &:hover {
    background-color: #daf1f5;
  }

  ${media.phablet`
    min-height: 60px;
    width: 100%;
    border-radius: 0px 0px 4px 4px;
    justify-content: center;
  `};
`
