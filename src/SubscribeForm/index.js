import React from 'react'
import styled from 'styled-components'

export default () => (
  <Form
    action="https://iterative.us18.list-manage.com/subscribe/post?u=a08bf93caae4063c4e6a351f6&amp;id=24c0ecc49a"
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
  border-radius: 4px;
  background-color: #ffffff;
  display: flex;
`

const Input = styled.input`
  display: flex;
  flex: 1;
  padding: 16px
  border: none;
  border-radius: 4px 0px 0px 4px;
  font-size: 18px;
  font-weight: 500;
`

const Button = styled.button`
  width: 115px;
  height: 100%;
  border: none;
  border-radius: 0px 4px 4px 0px;
  background-color: #e4fbff;
  font-size: 16px;
  font-weight: 500;
  color: #13adc7;
  cursor: pointer;
`
