import React from 'react'

import SocialIcons from './SocialIcons'
import LinkItems from './LinkItems'

import * as styles from './styles.module.css'

const Nav: React.FC = () => (
  <div className={styles.wrapper}>
    <LinkItems />
    <SocialIcons />
  </div>
)

export default Nav
