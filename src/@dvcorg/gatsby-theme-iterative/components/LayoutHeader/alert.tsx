import cn from 'classnames'
import React from 'react'

import { ReactComponent as VscodeIcon } from '../../../../../static/img/vscode-icon.svg'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'

import * as styles from './styles.module.css'

const LayoutAlert: React.FC<{ collapsed: boolean }> | false = ({
  collapsed
}) => (
  <div className={cn(styles.alert, collapsed && styles.collapsed)}>
    <div className={styles.text}>
      <span role="img" aria-label="VS Code Logo">
        <VscodeIcon width="22px" height="22px" />
      </span>
      <p>
        Check out our{' '}
        <Link href="https://marketplace.visualstudio.com/items?itemName=Iterative.dvc">
          new VS Code extension
        </Link>{' '}
        for experiment tracking and model development
      </p>
    </div>
  </div>
)

export default LayoutAlert
