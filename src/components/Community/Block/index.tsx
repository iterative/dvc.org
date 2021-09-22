import React from 'react'

import styles from './styles.module.css'

interface ICommunityBlockProps {
  children: React.ReactNode
  title?: React.ReactNode
  action?: React.ReactNode
  icon?: string
}

const Block: React.FC<ICommunityBlockProps> = ({
  title,
  children,
  action,
  icon
}) => (
  <div className={styles.container}>
    {title && (
      <div className={styles.header}>
        {title}
        {icon && <img className={styles.icon} src={icon} alt="" />}
      </div>
    )}
    <div className={styles.content}>{children}</div>
    {action && <div className={styles.action}>{action}</div>}
  </div>
)

export default Block
