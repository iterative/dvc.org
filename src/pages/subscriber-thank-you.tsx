import { PageProps } from 'gatsby'
import MainLayout from '../components/MainLayout'
import ThankYou from '../components/ThankYou'

const ThankYouPage = ({ location }: PageProps) => (
  <MainLayout location={location} className="mt-14">
    <ThankYou />
  </MainLayout>
)
export default ThankYouPage
