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
  const [tags] = useState('14160889')

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  return (
    <>
      <form
        className={cn('flex flex-col md:flex-row', 'w-full max-w-xl')}
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        onSubmit={async e => {
          e.preventDefault()
          setLoading(true)
          if (hiddenInputRef.current?.value) {
            // It's a bot.
            return
          }

          try {
            const res = await fetch('/api/subscribe/dvcx/waitlist', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email,
                tags
              })
            })
            if (!res.ok) {
              throw new Error('Failed to subscribe')
            }
            setShowSuccessMsg(true)
            setEmail('')
            setTimeout(() => {
              setShowSuccessMsg(false)
            }, 5000)
          } catch (error) {
            console.error(error)
          } finally {
            setLoading(false)
          }
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
          type="email"
          name="email"
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
        >
          {loading && <Spinner className="mr-3" />} Get on the waitlist
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
