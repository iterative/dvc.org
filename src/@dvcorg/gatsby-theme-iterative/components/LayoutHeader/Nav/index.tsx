import SocialIcons from './SocialIcons'
import LinkItems from './LinkItems'

import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'
import { ReactComponent as ExternalLinkIcon } from '../../../../../../static/img/external-link-icon.svg'

import * as styles from './styles.module.css'
import PseudoButton from '@dvcorg/gatsby-theme-iterative/src/components/PseudoButton'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import { studioUrl } from '../../../../../utils/externalUrls'

const Nav: React.FC = () => (
  <div className={styles.wrapper}>
    <LinkItems />
    <SocialIcons />
    <PseudoButton
      className={`${styles.getStartedButton} btn-with-focus`}
      href="/doc/start"
      onClick={(): void => logEvent('Nav', { Item: 'get-started' })}
      size="none"
    >
      Get Started
    </PseudoButton>
    <div className="text-dark hidden md:flex items-center">
      <div className="mx-3 select-none">|</div>
      <Link className="no-underline hover" href={studioUrl}>
        Get Enterprise{` `}
        <ExternalLinkIcon className="ml-0.5 inline-block w-4 h-4" />
      </Link>
    </div>
  </div>
)

export default Nav
