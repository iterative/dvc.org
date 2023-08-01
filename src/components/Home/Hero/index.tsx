import React from 'react'
import HeroTitleSection from './HeroTitleSection'
import HeroSection from './HeroSection'
import GetStartedWithDvcX from './GetStarted/GetStartedWithDvcX'
import GetStartedWithDvc from './GetStarted/GetStartedWithDvc'
import BetterTogether from './BetterTogether'

const Hero = () => {
  return (
    <>
      <HeroTitleSection className="pt-14" />
      <HeroSection />
      <GetStartedWithDvcX />
      <BetterTogether />
      <GetStartedWithDvc />
    </>
  )
}

export default Hero
