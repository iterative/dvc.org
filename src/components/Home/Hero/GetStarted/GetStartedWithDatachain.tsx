import HeroContainer from '../../../HeroContainer'
import { cn } from '../../../../utils'
import DatachainSlides from '../../LandingHero/DatachainSlides'
import GetOnTheWaitlistForm from '../GetOnTheWaitlist/Form'

const GetStartedWithDatachain = () => {
  return (
    <HeroContainer className="py-10 px-6" id="get-started-datachain">
      <div className="flex items-center md:justify-center">
        <h1 className={cn('text-2xl font-medium')}>Get Started with</h1>
        <span className="inline-block text-5xl ml-1">🔗</span>
      </div>
      <DatachainSlides />
      <div className={cn('flex flex-col items-center justify-center w-full')}>
        <GetOnTheWaitlistForm />
      </div>
    </HeroContainer>
  )
}

export default GetStartedWithDatachain
