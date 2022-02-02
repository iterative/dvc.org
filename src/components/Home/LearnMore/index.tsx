import React, { useCallback } from 'react'

import { logEvent } from 'gatsby-theme-iterative-docs/src/utils/front/plausible'
import {
  scrollIntoLayout,
  ease
} from 'gatsby-theme-iterative-docs/src/utils/front/scroll'

import * as styles from './styles.module.css'

interface ILearnMoreProps {
  scrollToRef: React.RefObject<HTMLElement>
}

const LearnMore: React.FC<ILearnMoreProps> = ({ scrollToRef }) => {
  const onClick = useCallback(() => {
    logEvent('Hero', { Item: 'learn-more' })
    scrollIntoLayout(scrollToRef?.current, {
      smooth: true,
      duration: 800,
      ease: ease.inOutCube
    })
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
