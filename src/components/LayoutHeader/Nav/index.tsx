import React from 'react'

import PseudoButton from '../../PseudoButton'
import SocialIcons from './SocialIcons'
import LinkItems from './LinkItems'

import { logEvent } from '../../../utils/front/plausible'

import * as styles from './styles.module.css'

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
