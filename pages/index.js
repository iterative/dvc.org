/*
 * Home page
 */

import React from 'react'
import styled from 'styled-components'
import Head from 'next/head'

import LearnMore from '../src/LearnMore'

import Page from '../src/Page'
import Hero from '../src/Hero'
import LandingHero from '../src/LandingHero'
import Diagram from '../src/Diagram'
import PromoSection from '../src/PromoSection'
import UseCases from '../src/UseCases'
import Subscribe from '../src/Subscribe'

/**
 * <HomePage> fn component
 */
const HomePage = () => (
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

/**
 * <HeadInjector> fn component
 */
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
    <title>Machine Learning Version Control System · DVC</title>
  </Head>
)

const LearnMoreSection = styled.div`
  z-index: 2;
  position: absolute;
  transform: translate(-50%, 0%);
  left: 50%;
  bottom: 16px;
`

export default HomePage
