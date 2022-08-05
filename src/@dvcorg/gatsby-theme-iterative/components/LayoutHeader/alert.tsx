import cn from 'classnames'
import React from 'react'

import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'

import * as styles from './styles.module.css'

const LayoutAlert: React.FC<{ collapsed: boolean }> | false = ({
  collapsed
}) => (
  <div className={cn(styles.alert, collapsed && styles.collapsed)}>
    <div className={styles.text}>
      <span role="img" aria-label="rocket">
        🚀
      </span>{' '}
      <p>
        New Release!{' '}
        <Link href="https://dvc.org/blog/iterative-studio-model-registry">
          Git-backed Machine Learning Model Registry
        </Link>{' '}
        for all your model management needs.
      </p>
    </div>
  </div>
)

export default LayoutAlert
