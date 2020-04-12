import React from 'react'
import cn from 'classnames'

import styles from './styles.module.css'

interface IPageContentProps {
  className?: string
  children: React.ReactNode
}

const PageContent: React.FC<IPageContentProps> = ({ className, children }) => (
  <div className={cn(styles.pageContent, className)}>{children}</div>
)

export default PageContent
