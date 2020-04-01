import React from 'react'

import styles from './styles.module.css'

interface IMarkdownProps {
  html: string
}

function Markdown({ html }: IMarkdownProps) {
  return (
    <div
      className={styles.wrapper}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default Markdown
