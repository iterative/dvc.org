import SocialIcons from './SocialIcons'
import LinkItems from './LinkItems'

import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'

import * as styles from './styles.module.css'
import PseudoButton from '@dvcorg/gatsby-theme-iterative/src/components/PseudoButton'

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
  </div>
)

export default Nav
