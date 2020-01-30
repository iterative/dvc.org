import React from 'react'
import styled from 'styled-components'

import LearnMore from '../LearnMore'
import Page from '../Page'
import Hero from '../Hero'
import LandingHero from '../LandingHero'
import Diagram from '../Diagram'
import PromoSection from '../PromoSection'
import UseCases from '../UseCases'
import Subscribe from '../Subscribe'

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

const LearnMoreSection = styled.div`
  z-index: 2;
  position: absolute;
  transform: translate(-50%, 0%);
  left: 50%;
  bottom: 16px;
`
