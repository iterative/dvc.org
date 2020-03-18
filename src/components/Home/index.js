import React from 'react'

import LearnMore from '../LearnMore'
import Hero from '../Hero'
import LandingHero from '../LandingHero'
import Diagram from '../Diagram'
import PromoSection from '../PromoSection'
import UseCases from '../UseCases'
import Subscribe from '../Subscribe'

import { LearnMoreSection } from './styles'

export default function HomePage() {
  return (
    <>
      <Hero>
        <LandingHero />
        <LearnMoreSection>
          <LearnMore />
        </LearnMoreSection>
        <span name="nextSlide" style={{ marginTop: `-58px` }} />
      </Hero>
      <Diagram />
      <PromoSection />
      <UseCases />
      <Subscribe />
    </>
  )
}
