import cn from 'classnames'
import React from 'react'

import { ReactComponent as GitHubIcon } from '../SocialIcon/github.svg'
import Link from '../Link'

import styles from './styles.module.css'

const LayoutAlert: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <div className={cn(styles.alert, collapsed && styles.collapsed)}>
    <span role="img" aria-label="rocket">
      🚀
    </span>{' '}
    Join <Link href="https://viewer.iterative.ai/">DVC UI</Link> beta program!{' '}
  </div>
)

export default LayoutAlert
