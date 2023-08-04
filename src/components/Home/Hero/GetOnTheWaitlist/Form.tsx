import React from 'react'

import { CTAButton } from '../HeroSection'
import { cn } from '../../../../utils'

const GetOnTheWaitlistForm = () => {
  return (
    <form
      className={cn('flex flex-col md:flex-row', 'w-full max-w-xl')}
      onSubmit={e => {
        e.preventDefault()
        const target = e.target as typeof e.target & {
          email: { value: string }
        }
        console.log({ email: target.email.value })
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
        placeholder="email address"
        required={true}
        aria-label="Enter your email"
      />
      <CTAButton
        className={cn(
          'bg-purple hover:bg-[var(--color-purple-hover)] text-light',
          'text-center',
          'mt-2 md:mt-0 md:rounded-l-none',
          'min-w-max',
          'justify-center',
          'min-h-[3rem]'
        )}
        type="submit"
      >
        Get on the waitlist
      </CTAButton>
    </form>
  )
}

export default GetOnTheWaitlistForm
