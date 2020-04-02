import React, { useState } from 'react'
import { Collapse } from 'react-collapse'

import styles from './styles.module.css'

interface ICollapsibleTextProps {
  children: React.ReactNode
  header: React.ReactNode
}

const CollapsibleText: React.SFC<ICollapsibleTextProps> = ({
  header,
  children
}) => {
  const [isOpened, setOpened] = useState(false)
  const toggle = () => setOpened(prev => !prev)
  const toggleFromKB = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.which === 13 || e.which === 32) {
      toggle()
    }
  }

  return (
    <div
      className={styles.container}
      onClick={toggle}
      onKeyPress={toggleFromKB}
      role="button"
      tabIndex={0}
    >
      {header}
      <Collapse isOpened={isOpened}>{children}</Collapse>
      {!isOpened && <div className={styles.moreText}>More...</div>}
    </div>
  )
}

export default CollapsibleText
