import React from 'react'

import WhatsNewModal from './WhatsNewModal'
import HeroSection from '../HeroSection'
import SubscribeSection from '../SubscribeSection'
import PromoSection from '../PromoSection'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import LearnMore from './LearnMore'
import LandingHero from './LandingHero'
import Diagram from './Diagram'
import UseCases from './UseCases'
import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'

import * as styles from './styles.module.css'
import CompanySlider from './LogosSlider'

const logGetStartedEvent = () => logEvent('Promo', { Item: 'get-started' })
const logUseCasesEvent = () => logEvent('Promo', { Item: 'use-cases' })

const Home: React.FC = () => {
  return (
    <>
      <WhatsNewModal />
      <HeroSection className={styles.heroSection}>
        <LandingHero />
        <CompanySlider />
        <LearnMore />
      </HeroSection>
      <Diagram />
      <PromoSection
        title="For data scientists, by data scientists"
        buttons={[
          <Link
            href="/doc/start"
            onClick={logGetStartedEvent}
            key="get-started"
          >
            Get Started
          </Link>,
          <Link
            href="/doc/use-cases"
            onClick={logUseCasesEvent}
            key="use-cases"
          >
            Use Cases
          </Link>
        ]}
      />
      <UseCases />
      <SubscribeSection />
    </>
  )
}

export default Home
