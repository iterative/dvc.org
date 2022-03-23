import React from 'react'
import cn from 'classnames'
import * as styles from './styles.module.css'

const Admonition: React.FC<{
  title?: string
  type?: 'info' | 'tip' | 'warn'
  icon?:
    | 'tip'
    | 'info'
    | 'warn'
    | 'fire'
    | 'exclamation'
    | 'lady_beetle'
    | 'bug'
}> = ({ title, type = 'info', children, icon = type }) => {
  const icons = {
    tip: '💡',
    info: 'ℹ️',
    warn: '⚠️',
    fire: '🔥',
    exclamation: '❗',
    lady_beetle: '🐞',
    bug: '🐛'
  }
  const genericTitles = {
    info: 'Info',
    tip: 'Tip',
    warn: 'Warning'
  }
  const setType = genericTitles[type] ? type : 'info'

  return (
    <div
      className={cn(styles.admonition, styles[setType])}
      style={{ '--icon': `"${icons[icon] || ''}"` } as React.CSSProperties}
    >
      <p className={styles.title}>{title || genericTitles[setType]}</p>
      <div className={styles.content}>{children}</div>
    </div>
  )
}

export default Admonition
