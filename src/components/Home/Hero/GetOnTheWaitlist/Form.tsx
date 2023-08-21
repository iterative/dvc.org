import React, { useRef, useState } from 'react'
import { nanoid } from 'nanoid'

import { CTAButton } from '../HeroSection'
import { cn } from '../../../../utils'
import Spinner from '../../../Spinner'

const GetOnTheWaitlistForm = () => {
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const honeypotNameRef = useRef(nanoid())

  const [showSuccessMsg, setShowSuccessMsg] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [tags] = useState('14160905')

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  return (
    <>
      <form
        className={cn('flex flex-col md:flex-row', 'w-full max-w-xl')}
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        method="post"
        target="_blank"
        action="https://dvc.us10.list-manage.com/subscribe/post?u=a08bf93caae4063c4e6a351f6&amp;id=763c86981c&amp;f_id=009ed9e5f0"
        onSubmit={async e => {
          if (hiddenInputRef.current?.value) {
            // It's a bot.
            e.preventDefault()
            return
          }
          setLoading(true)
          setShowSuccessMsg(true)
          setTimeout(() => {
            setEmail('')
            setShowSuccessMsg(false)
            setLoading(false)
          }, 5000)
        }}
      >
        <input
          className={cn(
            'px-3',
            'w-full min-h-[3rem]',
            'rounded-lg md:rounded-r-none',
            'shadow-inner ',
            'bg-light text-dark',
            'text-xl font-medium'
          )}
          id="mce-EMAIL"
          type="email"
          name="EMAIL"
          value={email}
          onChange={onChangeEmail}
          placeholder="email address"
          required={true}
          aria-label="Enter your email"
        />

        <div hidden>
          <input type="hidden" name="tags" value={tags} />
        </div>

        {/*real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
        <div
          style={{ position: 'absolute', left: '-5000px' }}
          aria-hidden="true"
        >
          <input
            type="text"
            name={honeypotNameRef.current}
            ref={hiddenInputRef}
            tabIndex={-1}
          />
        </div>

        <CTAButton
          className={cn(
            'bg-purple hover:bg-[var(--color-purple-hover)] text-light',
            'text-center',
            'mt-2 md:mt-0 md:rounded-l-none',
            'min-w-max',
            'justify-center',
            'min-h-[3rem]',
            'disabled:bg-gray-400 disabled:cursor-not-allowed'
          )}
          type="submit"
          disabled={loading}
          name="subscribe"
          id="mc-embedded-subscribe"
        >
          {loading && <Spinner className="mr-3" />} Join the waitlist
        </CTAButton>
      </form>
      {/* // thank you for joining the waitlist! */}
      <div className={cn('w-full text-center h-16 sm:h-10 pt-2')}>
        {showSuccessMsg && (
          <div className={cn('')}>
            ✅ <strong>Success!</strong> Thank you for joining the waitlist,
            keep an eye on your inbox for updates.
          </div>
        )}
      </div>
    </>
  )
}

export default GetOnTheWaitlistForm
