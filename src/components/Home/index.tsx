import Link from '@dvcorg/gatsby-theme/src/components/Link'
import { logEvent } from '@dvcorg/gatsby-theme/src/utils/front/plausible'

import HeroSection from '../HeroSection'
import PromoSection from '../PromoSection'
import SubscribeSection from '../SubscribeSection'

import Diagram from './Diagram'
import LandingHero from './LandingHero'
import LearnMore from './LearnMore'
import CompanySlider from './LogosSlider'
import * as styles from './styles.module.css'
import UseCases from './UseCases'
import WhatsNewModal from './WhatsNewModal'

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
