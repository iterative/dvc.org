import HeroContainer from '../../../HeroContainer'
import { cn } from '../../../../utils'
import DatachainSlides from '../../LandingHero/DatachainSlides'
import { ReactComponent as GithubSVG } from '@dvcorg/gatsby-theme-iterative/src/components/SocialIcon/github.svg'

import { CTAButton } from '../HeroSection'
import { githubDatachainUrl } from '../../../../utils/externalUrls'
import { navigateLink } from '../../../../utils/urls'

const GetStartedWithDatachain = () => {
  return (
    <HeroContainer className="py-10 px-6" id="get-started-datachain">
      <div className="flex items-center md:justify-center">
        <h1 className={cn('text-2xl font-medium')}>Get Started with</h1>
        <span className="inline-block text-5xl ml-1">🔗</span>
      </div>
      <DatachainSlides />
      <div className={cn('flex flex-col items-center justify-center w-full')}>
        <CTAButton
          className={cn(
            'bg-purple hover:bg-[var(--color-purple-hover)] text-light',
            'text-center',
            'min-w-max',
            'justify-center',
            'min-h-[3rem]',
            'disabled:bg-gray-400 disabled:cursor-not-allowed'
          )}
          type="button"
          onClick={() => {
            navigateLink(githubDatachainUrl)
          }}
        >
          Star us on Github <GithubSVG className="h-6 w-6 inline-block" />
        </CTAButton>
      </div>
    </HeroContainer>
  )
}

export default GetStartedWithDatachain
