import React from 'react'
import styled from 'styled-components'
import Head from 'next/head'

import LearnMore from '../src/components/LearnMore'
import Page from '../src/components/Page'
import Hero from '../src/components/Hero'
import LandingHero from '../src/components/LandingHero'
import Diagram from '../src/components/Diagram'
import PromoSection from '../src/components/PromoSection'
import UseCases from '../src/components/UseCases'
import Subscribe from '../src/components/Subscribe'

import { META_BASE_TITLE } from '../src/consts'

const HeadInjector = () => (
  <Head>
    <link
      rel="stylesheet"
      type="text/css"
      charSet="UTF-8"
      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
    />
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
    />
    <title>{META_BASE_TITLE}</title>
  </Head>
)

export default function HomePage() {
  return (
    <Page stickHeader={true}>
      <HeadInjector />
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
