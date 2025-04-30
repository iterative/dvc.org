import { PageProps } from 'gatsby'

import Home from '../components/Home'
import MainLayout from '../components/MainLayout'

const HomePage = ({ location }: PageProps) => (
  <MainLayout
    location={location}
    className="mt-14 bg-gradient-126 from-[#DAFAFF] via-[#ECDEFF] to-[#FFF3EF]"
  >
    <Home />
  </MainLayout>
)

export default HomePage
