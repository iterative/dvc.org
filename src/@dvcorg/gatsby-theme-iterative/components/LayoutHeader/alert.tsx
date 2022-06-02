import cn from 'classnames'
import React from 'react'

import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'

import * as styles from './styles.module.css'

const LayoutAlert: React.FC<{ collapsed: boolean }> | false = ({
  collapsed
}) => (
  <div className={cn(styles.alert, collapsed && styles.collapsed)}>
    <span role="img" aria-label="rocket">
      🚀
    </span>{' '}
    Our new tool for deployment,{' '}
    <Link href="https://mlem.ai" tabIndex={collapsed ? -1 : undefined}>
      MLEM
    </Link>
    , has been released!
  </div>
)

export default LayoutAlert
