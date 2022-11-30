import * as styles from './styles.module.css'
import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'
import cn from 'classnames'
import React from 'react'

const logLearnMoreEvent = () => {
  logEvent('Hero', { Item: 'learn-more' })
}

const LearnMore = () => {
  return (
    <a
      className={cn(styles.button, 'link-with-focus')}
      onClick={logLearnMoreEvent}
      href="#diagram-section"
    >
      <span className={styles.icon}>
        <img src="/img/learn-more.svg" alt="Learn More" />
      </span>
      <span className={styles.caption}>Learn more</span>
    </a>
  )
}

export default LearnMore
