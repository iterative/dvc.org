import React from 'react'

import WhatsNewModal from './WhatsNewModal'

import SubscribeSection from '../SubscribeSection'

import CompanySlider from './LogosSlider'
import Hero from './Hero'

const Home: React.FC = () => {
  return (
    <>
      <WhatsNewModal />
      <Hero />
      <div className="mx-auto max-w-screen-2xl w-full">
        <CompanySlider />
      </div>
      <SubscribeSection />
    </>
  )
}

export default Home
