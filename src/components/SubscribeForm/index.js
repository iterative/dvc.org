import React from 'react'

import { Button, Form, Input } from './styles'

export default function SubscribeForm() {
  return (
    <Form
      action="https://sweedom.us10.list-manage.com/subscribe/post?u=a08bf93caae4063c4e6a351f6&amp;id=24c0ecc49a"
      method="post"
      id="mc-embedded-subscribe-form"
      name="mc-embedded-subscribe-form"
      className="validate"
      target="_blank"
      novalidate
    >
      <Input
        type="email"
        name="EMAIL"
        className="email"
        id="mce-EMAIL"
        placeholder="email address"
        required
      />

      {/*
        real people should not fill this in and expect good things - 
        do not remove this or risk form bot signups
      */}
      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
        <input
          type="text"
          name="b_a08bf93caae4063c4e6a351f6_24c0ecc49a"
          tabIndex="-1"
        />
      </div>

      <Button type="submit" name="subscribe" id="mc-embedded-subscribe">
        Subscribe
      </Button>
    </Form>
  )
}
