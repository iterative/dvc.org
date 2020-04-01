import React from 'react'

import LearnMore from './LearnMore'
import HeroSection from '../HeroSection'
import LandingHero from './LandingHero'
import Diagram from './Diagram'
import PromoSection from './PromoSection'
import UseCases from './UseCases'
import SubscribeSection from '../SubscribeSection'

import { LearnMoreSection } from './styles'

export default function HomePage() {
  return (
    <>
      <HeroSection>
        <LandingHero />
        <LearnMoreSection>
          <LearnMore />
        </LearnMoreSection>
        <span name="nextSlide" style={{ marginTop: `-58px` }} />
      </HeroSection>
      <Diagram />
      <PromoSection />
      <UseCases />
      <SubscribeSection />
    </>
  )
}
