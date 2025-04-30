import { useLocation } from '@reach/router'
import cn from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import { Collapse } from 'react-collapse'
import { useWindowSize } from 'react-use'

import * as styles from './styles.module.css'

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
  const { width } = useWindowSize()
  const location = useLocation()

  useEffect(() => {
    if (anchor && location.hash === `#${anchor}`) {
      setIsContentVisible(true)
    }
  }, [anchor, location.hash])

  useEffect(() => setIsTablet(width <= 768), [width])

  return (
    <div
      className={cn(styles.container, background && styles.hasBg)}
      id={anchor}
    >
      <button
        className={styles.header}
        style={{ color }}
        onClick={toggleVisibility}
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
      </button>
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
