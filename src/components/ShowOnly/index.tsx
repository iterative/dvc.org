import React from 'react'
import cn from 'classnames'

import styles from './styles.module.css'

interface IShowOnlyProps {
  on: 'mobile' | 'desktop'
  className?: string
  children: React.ReactNode
}

const ShowOnly: React.SFC<IShowOnlyProps> = ({ on, className, children }) => (
  <div className={cn(styles[on], className)}>{children}</div>
)

export default ShowOnly
