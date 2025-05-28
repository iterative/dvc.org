import cn from 'classnames'

import { logEvent } from '@dvcorg/gatsby-theme/src/utils/front/plausible'

import * as styles from './styles.module.css'

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
