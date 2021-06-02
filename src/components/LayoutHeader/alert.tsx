import cn from 'classnames'
import React from 'react'

import Link from '../Link'

import styles from './styles.module.css'

const LayoutAlert: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <div className={cn(styles.alert, collapsed && styles.collapsed)}>
    <span role="img" aria-label="studio">
      <img src="img/studio-icon.svg" alt=""></img>
    </span>{' '}
    <Link href="https://studio.iterative.ai">DVC Studio</Link>, the online UI
    for DVC, is live!{' '}
  </div>
)

export default LayoutAlert
