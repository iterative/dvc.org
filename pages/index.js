import React, { Component } from 'react'
import styled from 'styled-components'
import Animate, { BounceIn } from 'animate-css-styled-components'

import LearnMore from '../src/LearnMore'

import Page from '../src/Page'
import Hero from '../src/Hero'
import LandingHero from '../src/LandingHero'
import Diagram from '../src/Diagram'
import PromoSection from '../src/PromoSection'
import UseCases from '../src/UseCases'
import Subscribe from '../src/Subscribe'

export default () => (
  <Page stickHeader={true}>
    <Hero>
      <LandingHero />
      <a name="nextSlide" style={{ marginTop: `-58px` }} />
      <LearnMoreSection>
        {/*<Animate Animation={BounceIn} duration={`1s`} delay={`2s`}>*/}
        <LearnMore />
        {/*</Animate>*/}
      </LearnMoreSection>
    </Hero>
    <Diagram />
    <PromoSection />
    <UseCases />
    <Subscribe />
  </Page>
)

const LearnMoreSection = styled.div`
  z-index: 2;
  position: absolute;
  transform: translate(-50%, 0%);
  left: 50%;
  bottom: 16px;
`
