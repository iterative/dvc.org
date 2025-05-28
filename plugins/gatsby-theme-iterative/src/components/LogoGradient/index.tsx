import React from 'react'
import Link from '../Link'

import * as styles from './styles.module.css'
import cn from 'classnames'

const LogoGradient = ({
  href,
  className,
  children
}: {
  href?: string
  className?: string
  children: React.ReactNode
}) => {
  return href ? (
    <Link
      href={href}
      className={cn(
        styles.logoGradient,
        'font-medium no-underline whitespace-nowrap ml-1.5 py-2.5 focus:opacity-75 md:px-2.5 md:ml-0',
        className
      )}
    >
      {children}
    </Link>
  ) : (
    <span className={cn(styles.logoGradient, className)}>{children}</span>
  )
}

export default LogoGradient
