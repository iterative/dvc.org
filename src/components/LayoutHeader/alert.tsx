import cn from 'classnames'
import React from 'react'

import Link from '../Link'

import styles from './styles.module.css'

const LayoutAlert: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <div className={cn(styles.alert, collapsed && styles.collapsed)}>
    <span role="img" aria-label="shield">
      🛡
    </span>{' '}
    <Link href="/enterprise">DVC for Enterprise</Link> - data access control &
    compliance!{' '}
  </div>
)

export default LayoutAlert
