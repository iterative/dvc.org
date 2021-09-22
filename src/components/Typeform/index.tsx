import React from 'react'
import styles from './styles.module.css'

const Typeform: React.FC<{
  url: string
  title: string
}> = ({ url, title }) => {
  return <iframe className={styles.typeformIframe} src={url} title={title} />
}

export default Typeform
