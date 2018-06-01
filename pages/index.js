import React, { Component } from 'react'

import Layout from '../src/Layout'
import Hero from '../src/Hero'
import LandingHero from '../src/LandingHero'
import Diagram from '../src/Diagram'
import PromoSection from '../src/PromoSection'
import UseCases from '../src/UseCases'
import Subscribe from '../src/Subscribe'

export default () => (
  <Layout stickHeader={true}>
    <Hero>
	    <LandingHero />
    </Hero>
	  <Diagram />
	  <PromoSection />
	  <UseCases />
	  <Subscribe />
  </Layout>
)
