import cn from 'classnames'
import React from 'react'

import styles from './styles.module.css'

interface IHamburgetProps {
  opened: boolean
}

export default function HamburgerIcon({ opened }: IHamburgetProps) {
  return (
    <div className={cn(styles.wrapper, opened && styles.opened)}>
      <div className={cn(styles.line, styles.first)} />
      <div className={cn(styles.line, styles.second)} />
      <div className={cn(styles.line, styles.third)} />
    </div>
  )
}
