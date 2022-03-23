import React from 'react'
import cn from 'classnames'
import * as styles from './styles.module.css'

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
const defaultType = 'info'

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
}> = ({ title, type = defaultType, children, icon = type }) => {
  const setType = genericTitles[type] ? type : defaultType
  const iconContent = icons[icon] || ''

  return (
    <div
      className={cn(styles.admonition, styles[setType])}
      style={{ '--icon': `"${iconContent}"` } as React.CSSProperties}
    >
      <p className={cn(styles.title, !iconContent && styles.noIcon)}>
        {title || genericTitles[setType]}
      </p>
      <div className={styles.content}>{children}</div>
    </div>
  )
}

export default Admonition
