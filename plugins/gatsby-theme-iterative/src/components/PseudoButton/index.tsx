import cn from 'classnames'
import React from 'react'

import Link, {
  ILinkProps
} from '@dvcorg/gatsby-theme-iterative/src/components/Link'

import * as styles from './styles.module.css'

type IPseudoButtonProps = {
  children: React.ReactNode
  className?: string
  type?: 'primary' | 'secondary'
  size?: 'small' | 'big' | 'none'
} & ILinkProps

const PseudoButton: React.FC<IPseudoButtonProps> = ({
  children,
  className,
  type = 'primary',
  size = 'small',
  ...restProps
}) => (
  <Link
    className={cn(
      styles.button,
      styles[type],
      styles[size],
      className || styles.defaultButton
    )}
    {...restProps}
  >
    {children}
  </Link>
)

export default PseudoButton
