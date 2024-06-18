import WhatsNewModal from './WhatsNewModal'

import SubscribeSection from '../SubscribeSection'

import CompanySlider from './LogosSlider'
import Hero from './Hero'

const Home: React.FC = () => {
  return (
    <>
      <WhatsNewModal />
      <Hero />
      <CompanySlider />
      <SubscribeSection />
    </>
  )
}

export default Home
