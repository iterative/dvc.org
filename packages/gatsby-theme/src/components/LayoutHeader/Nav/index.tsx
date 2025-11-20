import LinkItems from '@dvcorg/gatsby-theme/src/components/LayoutHeader/Nav/LinkItems'
import SocialIcons from '@dvcorg/gatsby-theme/src/components/LayoutHeader/Nav/SocialIcons'
import PseudoButton from '@dvcorg/gatsby-theme/src/components/PseudoButton'
import { logEvent } from '@dvcorg/gatsby-theme/src/utils/front/plausible'

import * as styles from './styles.module.css'

const Nav: React.FC = () => (
  <div className={styles.wrapper}>
    <LinkItems />
    <SocialIcons />
    <PseudoButton
      className={`${styles.getStartedButton} btn-with-focus`}
      href="/start"
      onClick={(): void => logEvent('Nav', { Item: 'get-started' })}
      size="none"
    >
      Get Started
    </PseudoButton>
  </div>
)

export default Nav
