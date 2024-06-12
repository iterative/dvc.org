import React from 'react'
import HeroTitleSection from './HeroTitleSection'
import HeroSection from './HeroSection'
import GetStartedWithDatachain from './GetStarted/GetStartedWithDatachain'
import GetStartedWithDvc from './GetStarted/GetStartedWithDvc'
import BetterTogether from './BetterTogether'

const Hero = () => {
  return (
    <>
      <HeroTitleSection />
      <HeroSection />
      <GetStartedWithDatachain />
      <BetterTogether />
      <GetStartedWithDvc />
    </>
  )
}

export default Hero
