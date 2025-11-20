import { logEvent } from '@dvcorg/gatsby-theme/src/utils/front/plausible'

import PseudoButton from '../../PseudoButton'

import LinkItems from './LinkItems'
import SocialIcons from './SocialIcons'
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
