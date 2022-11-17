import React, { useRef, useCallback } from 'react'

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

const Home: React.FC = () => {
  const diagramSectionRef = useRef<HTMLElement>(null)
  const useCasesSectionRef = useRef<HTMLElement>(null)
  const goToDocGetStarted = useCallback(
    () => logEvent('Promo', { Item: 'get-started' }),
    []
  )
  const goToUseCases = useCallback(
    () => logEvent('Promo', { Item: 'use-cases' }),
    []
  )

  return (
    <>
      <WhatsNewModal />
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
          <Link href="/doc/use-cases" onClick={goToUseCases} key="use-cases">
            Use Cases
          </Link>
        ]}
      />
      <UseCases ref={useCasesSectionRef} />
      <SubscribeSection />
    </>
  )
}

export default Home
