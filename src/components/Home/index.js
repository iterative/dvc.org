import React from 'react'

import LearnMore from '../LearnMore'
import Page from '../Page'
import Hero from '../Hero'
import LandingHero from '../LandingHero'
import Diagram from '../Diagram'
import PromoSection from '../PromoSection'
import UseCases from '../UseCases'
import Subscribe from '../Subscribe'

import { LearnMoreSection } from './styles'

export default function HomePage() {
  return (
    <Page stickHeader={true}>
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
    </Page>
  )
}
