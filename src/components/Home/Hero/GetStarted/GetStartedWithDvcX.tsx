import React from 'react'
import HeroContainer from '../../../HeroContainer'
import { StaticImage } from 'gatsby-plugin-image'
import { cn } from '../../../../utils'
import DvcxSlides from '../../LandingHero/DvcxSlides'
import { ReactComponent as ArrowRight } from '../../../../../static/img/arrow_right_white.svg'

import { CTAButton } from '../HeroSection'

const GetStartedWithDvcX = () => {
  return (
    <HeroContainer className="py-10 px-6">
      <div className="flex items-center md:justify-center">
        <h1 className={cn('text-2xl font-medium')}>Get Started with</h1>
        <StaticImage
          height={40}
          src="../../../../../static/img/logos/dvcx.svg"
          alt="DVCx Logo"
        />
      </div>
      <DvcxSlides />
      <div className={cn('flex justify-center')}>
        <CTAButton className={cn('bg-purple text-light')}>
          Get on the waitlist
          <ArrowRight className="ml-4" />
        </CTAButton>
      </div>
    </HeroContainer>
  )
}

export default GetStartedWithDvcX
