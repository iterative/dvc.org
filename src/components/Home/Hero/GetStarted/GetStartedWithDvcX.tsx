import React from 'react'
import HeroContainer from '../../../HeroContainer'
import { cn } from '../../../../utils'
import DvcxSlides from '../../LandingHero/DvcxSlides'
import GetOnTheWaitlistForm from '../GetOnTheWaitlist/Form'

const GetStartedWithDvcX = () => {
  return (
    <HeroContainer className="py-10 px-6" id="get-started-dvcx">
      <div className="flex items-end md:justify-center">
        <h1 className={cn('text-2xl font-medium')}>Get Started with</h1>
        <img src="/img/logos/dvcx.svg" alt="DVCx Logo" className="h-12 -ml-1" />
      </div>
      <DvcxSlides />
      <div className={cn('flex flex-col items-center justify-center w-full')}>
        <GetOnTheWaitlistForm />
      </div>
    </HeroContainer>
  )
}

export default GetStartedWithDvcX
