import React from 'react'
import cn from 'classnames'

import styles from './styles.module.css'

type ITwoRowsButtonProps = {
  mode: 'azure' | 'purple' | 'outline'
  className?: string
  title: string
  description: string
  icon?: React.ReactNode
  children?: React.ReactNode
  active?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const TwoRowsButton: React.FC<ITwoRowsButtonProps> = ({
  className,
  icon,
  title,
  description,
  children,
  mode,
  type,
  active,
  ...props
}) => {
  return (
    <button
      className={cn(
        styles.button,
        styles[mode],
        active && styles.active,
        icon && styles.withIcon,
        className
      )}
      type={type || 'button'}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
      </span>
      {children}
    </button>
  )
}

export default TwoRowsButton
