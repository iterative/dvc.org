import React, { useState } from 'react'
import { Collapse } from 'react-collapse'

import { isTriggeredFromKB } from '../../../../utils/front/keyboard'

import styles from './styles.module.css'

interface ICollapsibleTextProps {
  children: React.ReactNode
  header: React.ReactNode
}

const CollapsibleText: React.FC<ICollapsibleTextProps> = ({
  header,
  children
}) => {
  const [isOpened, setOpened] = useState(false)
  const toggle = (): void => setOpened(prev => !prev)
  const toggleFromKB = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (isTriggeredFromKB(e)) {
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
      <span hidden={!isOpened}>
        <Collapse isOpened={isOpened}>{children}</Collapse>
      </span>
      {!isOpened && <div className={styles.moreText}>More...</div>}
    </div>
  )
}

export default CollapsibleText
