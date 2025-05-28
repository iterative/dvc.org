import Link from '../../Link'
import { ReactComponent as GithubSVG } from '../../SocialIcon/github.svg'

export const AlertContent = () => (
  <>
    <span role="img" aria-label="rocket">
      🚀
    </span>{' '}
    DataChain Open-Source Release.{' '}
    <Link href="https://github.com/iterative/datachain">
      Star us on <GithubSVG className="h-5 w-5 inline-block align-middle" />
    </Link>
    !
  </>
)
