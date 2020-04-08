import cn from 'classnames'
import React from 'react'

import styles from './styles.module.css'

interface IHamburgetProps {
  opened?: boolean
}

const HamburgerIcon: React.SFC<IHamburgetProps> = ({ opened }) => (
  <div className={cn(styles.wrapper, opened && styles.opened)}>
    <div className={cn(styles.line, styles.first)} />
    <div className={cn(styles.line, styles.second)} />
    <div className={cn(styles.line, styles.third)} />
  </div>
)

export default HamburgerIcon
