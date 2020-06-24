import React, { useRef, useCallback } from 'react'

import HeroSection from '../HeroSection'
import SubscribeSection from '../SubscribeSection'
import PromoSection from '../PromoSection'
import Link from '../Link'
import LearnMore from './LearnMore'
import LandingHero from './LandingHero'
import Diagram from './Diagram'
import UseCases from './UseCases'
import { logEvent } from '../../utils/front/ga'

import styles from './styles.module.css'

const Home: React.FC = () => {
  const diagramSectionRef = useRef<HTMLElement>(null)
  const useCasesSectionRef = useRef<HTMLElement>(null)
  const goToDocGetStarted = useCallback(
    () => logEvent('promo', 'get-started'),
    []
  )
  const goToFeatures = useCallback(() => logEvent('promo', 'features'), [])

  return (
    <>
      <HeroSection className={styles.heroSection}>
        <LandingHero scrollToRef={useCasesSectionRef} />
        <LearnMore scrollToRef={diagramSectionRef} />
      </HeroSection>
      <Diagram ref={diagramSectionRef} />
      <PromoSection
        title="For data scientists, by data scientists"
        buttons={[
          <Link href="/doc/start" onClick={goToDocGetStarted} key="get-started">
            Get Started
          </Link>,
          <Link href="/features" onClick={goToFeatures} key="features">
            Full Features
          </Link>
        ]}
      />
      <UseCases ref={useCasesSectionRef} />
      <SubscribeSection />
    </>
  )
}

export default Home
