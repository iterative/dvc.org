import React, { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'
import { useLocation } from '@reach/router'
import { Collapse } from 'react-collapse'
import { useWindowSize } from 'react-use'

import { isTriggeredFromKB } from '../../../utils/front/keyboard'
import { screens } from '../../../../config/postcss/media'

import styles from './styles.module.css'

export interface ICommunitySection {
  anchor: string
  background?: string
  color: string
  contentVisible?: boolean
  children: React.ReactNode
  description: string
  icon: string
  mobileDescription: string
  title: string
}

const Section: React.FC<ICommunitySection> = ({
  anchor,
  background,
  color,
  contentVisible = false,
  children,
  description,
  icon,
  mobileDescription,
  title
}) => {
  const [isTablet, setIsTablet] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(contentVisible)
  const toggleVisibility = useCallback(
    () => setIsContentVisible(!isContentVisible),
    [isContentVisible]
  )
  const toggleFromKeyboard = useCallback(
    (e: React.KeyboardEvent) => {
      if (isTriggeredFromKB(e)) {
        toggleVisibility()
      }
    },
    [toggleVisibility]
  )
  const { width } = useWindowSize()
  const location = useLocation()

  useEffect(() => {
    if (anchor && location.hash === `#${anchor}`) {
      setIsContentVisible(true)
    }
  }, [location.hash])

  useEffect(() => setIsTablet(width <= screens.tablet), [width])

  return (
    <div
      className={cn(styles.container, background && styles.hasBg)}
      id={anchor}
    >
      <div
        className={styles.header}
        style={{ color }}
        onClick={toggleVisibility}
        onKeyDown={toggleFromKeyboard}
        role="button"
        tabIndex={0}
      >
        <img className={styles.icon} src={icon} alt="" />
        <div>
          <div
            className={cn(
              styles.title,
              isContentVisible && styles.isContentVisible
            )}
          >
            {title}
          </div>
          <div className={styles.description}>{description}</div>
          <div className={cn(styles.description, styles.mobile)}>
            {mobileDescription}
          </div>
        </div>
      </div>
      {background && <img className={styles.picture} src={background} alt="" />}

      {isTablet ? (
        <span hidden={!isContentVisible}>
          <Collapse isOpened={isContentVisible}>{children}</Collapse>
        </span>
      ) : (
        children
      )}
    </div>
  )
}

export default Section
