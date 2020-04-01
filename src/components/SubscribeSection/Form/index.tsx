import React, { FormEvent } from 'react'

import { logEvent } from '../../../utils/ga'

import styles from './styles.module.css'

const honeyPot = 'b_a08bf93caae4063c4e6a351f6_24c0ecc49a'

interface IFormElements {
  [honeyPot]: HTMLFormElement
}

const sendGAEvent = ({ target: form }: FormEvent<HTMLFormElement>) => {
  const formElements: IFormElements = (form as any).elements
  if (formElements[honeyPot].value) {
    // It's a bot.
    return
  }

  logEvent('subscribe-form', 'subscribe')
}

export default function Form() {
  return (
    <form
      className={styles.form}
      action="https://sweedom.us10.list-manage.com/subscribe/post?u=a08bf93caae4063c4e6a351f6&amp;id=24c0ecc49a"
      method="post"
      id="mc-embedded-subscribe-form"
      name="mc-embedded-subscribe-form"
      target="_blank"
      onSubmit={sendGAEvent}
    >
      <input
        className={styles.input}
        type="email"
        name="EMAIL"
        id="mce-EMAIL"
        placeholder="email address"
        required={true}
      />

      {/*real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
        <input type="text" name={honeyPot} tabIndex={-1} />
      </div>

      <button
        className={styles.button}
        type="submit"
        name="subscribe"
        id="mc-embedded-subscribe"
      >
        Subscribe
      </button>
    </form>
  )
}
