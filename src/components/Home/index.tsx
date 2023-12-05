import React from 'react'

import WhatsNewModal from './WhatsNewModal'
import HeroContainer from '../HeroContainer'
import SubscribeSection from '../SubscribeSection'

import * as styles from './styles.module.css'
import CompanySlider from './LogosSlider'
import Hero from './Hero'

const Home: React.FC = () => {
  return (
    <>
      <WhatsNewModal />
      <Hero />
      <HeroContainer className={styles.heroContainer}>
        <CompanySlider />
      </HeroContainer>
      <SubscribeSection />
    </>
  )
}

export default Home
