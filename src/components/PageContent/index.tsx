import React from 'react'

import styles from './styles.module.css'

const PageContent: React.SFC<{ children: React.ReactNode }> = ({
  children
}) => <div className={styles.pageContent}>{children}</div>

export default PageContent
