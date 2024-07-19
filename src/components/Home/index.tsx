import WhatsNewModal from './WhatsNewModal'

import SubscribeSection from '../SubscribeSection'

import CompanySlider from './LogosSlider'
import Hero from './Hero'
import Alert from './Alert'

const Home: React.FC = () => {
  return (
    <>
      <WhatsNewModal />
      <Alert />
      <Hero />
      <CompanySlider />
      <SubscribeSection />
    </>
  )
}

export default Home
