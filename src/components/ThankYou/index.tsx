import React from 'react'
import styles from './styles.module.css'

const ThankYouPage: React.FC = () => (
  <div className={styles.wrapper}>
    <h1 className={styles.heading}>Thanks for subscribing!</h1>
    <p className={styles.copy}>Keep an eye on your inbox</p>
  </div>
)

export default ThankYouPage
