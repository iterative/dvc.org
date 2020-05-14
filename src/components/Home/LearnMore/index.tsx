import React, { useCallback } from 'react'

import { logEvent } from '../../../utils/front/ga'
import { scrollIntoLayout, ease } from '../../../utils/front/scroll'

import styles from './styles.module.css'

interface ILearnMoreProps {
  scrollToRef: React.RefObject<HTMLElement>
}

const LearnMore: React.FC<ILearnMoreProps> = ({ scrollToRef }) => {
  const onClick = useCallback(() => {
    logEvent('hero', 'learn-more')
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
