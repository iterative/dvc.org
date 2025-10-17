import { PageProps } from 'gatsby'

import Home from '../components/Home'
import MainLayout from '../components/MainLayout'

const HomePage = ({ location }: PageProps) => (
  <MainLayout location={location} className="mt-14">
    <Home />
  </MainLayout>
)

export default HomePage
