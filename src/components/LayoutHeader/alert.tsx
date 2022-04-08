import cn from 'classnames'
import React from 'react'

import Link from 'gatsby-theme-iterative-docs/src/components/Link'

import * as styles from './styles.module.css'

const LayoutAlert: React.FC<{ collapsed: boolean }> | false = ({
  collapsed
}) => (
  <div className={cn(styles.alert, collapsed && styles.collapsed)}>
    <span role="img" aria-label="rocket">
      🚀
    </span>{' '}
    <Link
      href="https://studio.iterative.ai"
      tabIndex={collapsed ? -1 : undefined}
    >
      Iterative Studio
    </Link>
    , the online UI for DVC, is live!{' '}
  </div>
)

export default LayoutAlert
