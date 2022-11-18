import React, { useCallback } from 'react'

import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'

import * as styles from './styles.module.css'

interface ILearnMoreProps {
  scrollToRef: React.RefObject<HTMLElement>
}

const LearnMore: React.FC<ILearnMoreProps> = ({ scrollToRef }) => {
  const onClick = useCallback(() => {
    logEvent('Hero', { Item: 'learn-more' })
    const scrollToEl = scrollToRef?.current
    if (scrollToEl) {
      scrollToEl.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [scrollToRef?.current])

  return (
    <button className={`${styles.button} link-with-focus`} onClick={onClick}>
      <span className={styles.icon}>
        <img src="/img/learn-more.svg" alt="Learn More" />
      </span>
      <span className={styles.caption}>Learn more</span>
    </button>
  )
}

export default LearnMore
