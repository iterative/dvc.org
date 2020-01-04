import Diagram from '../src/Diagram'
import Head from 'next/head'
import Hero from '../src/Hero'
import LandingHero from '../src/LandingHero'
import LearnMore from '../src/LearnMore'
import { META_BASE_TITLE } from '../src/consts'
import Page from '../src/Page'
import PromoSection from '../src/PromoSection'
import React from 'react'
import Subscribe from '../src/Subscribe'
import UseCases from '../src/UseCases'
import styled from 'styled-components'

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
