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
    Check out our newest tool, <Link href="https://cml.dev">CML</Link>!{' '}
    <Link
      className={styles.gitHubAlertLink}
      href="https://github.com/iterative/cml"
      title="Star us on GitHub!"
    >
      <GitHubIcon width="1em" height="1em" viewBox="5 5 30 30" />
    </Link>
  </div>
)

export default LayoutAlert
