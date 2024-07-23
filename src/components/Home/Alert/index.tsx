import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import { cn } from '../../../utils'
import { githubDatachainUrl } from '../../../utils/externalUrls'
import { ReactComponent as GithubSVG } from '@dvcorg/gatsby-theme-iterative/src/components/SocialIcon/github.svg'

const banner = {
  title: 'DataChain Open-Source Release',
  subtitle: 'A New Way to Manage your Unstructured Data',
  link: githubDatachainUrl
}

const Alert = () => (
  <>
    <div className={cn('py-2', 'bg-orange text-white', `w-full`)}>
      <div className="flex items-center gap-3 justify-center">
        <div className="text-right">
          <strong className="font-medium text-xl">{banner.title}</strong>
          <div className="text-sm">{banner.subtitle}</div>
        </div>
        <div>
          <Link
            href={banner.link}
            className={cn(
              'no-underline',
              'px-2 py-1',
              'rounded',
              'font-medium',
              'whitespace-nowrap',
              'bg-orange-50 text-orange-700',
              'hover:bg-white',
              'flex items-center'
            )}
          >
            Star us on GitHub{' '}
            <GithubSVG className="h-5 w-5 inline-block text-orange" />
          </Link>
        </div>
      </div>
    </div>
  </>
)

export default Alert
