import React, { useState, useEffect, useRef } from 'react'
import cn from 'classnames'
import throttle from 'lodash/throttle'

import { IHeading } from '../'
import Link from '../../Link'
import Tutorials from '../TutorialsLinks'

import { getScrollPosition, getHeaderHeight } from '../../../utils/front/scroll'
import { allImagesLoadedInContainer } from '../../../utils/front/images'

import sharedStyles from '../styles.module.css'
import styles from './styles.module.css'

interface IRightPanelProps {
  headings: Array<IHeading>
  tutorials: { [type: string]: string }
  githubLink: string
}

interface IHeadingsCoordinates {
  [offset: string]: string
}

const RightPanel: React.FC<IRightPanelProps> = ({
  headings,
  tutorials,
  githubLink
}) => {
  const [documentHeight, setDocumentHeight] = useState(0)
  const [headingsOffsets, setHeadingsOffsets] = useState<IHeadingsCoordinates>(
    {}
  )
  const [currentHeadingSlug, setCurrentHeadingSlug] = useState<string | null>(
    null
  )
  const updateCurrentHeader = (): void => {
    const currentScroll = getScrollPosition()
    const coordinateKeys = Object.keys(headingsOffsets)

    if (!coordinateKeys.length) return

    const headerHeight = getHeaderHeight()
    const filteredKeys = coordinateKeys.filter(
      offsetTop =>
        parseInt(offsetTop, 10) <=
        currentScroll + (documentHeight - headerHeight) / 2
    )

    const newCurrentHeadingSlug = filteredKeys.length
      ? headingsOffsets[filteredKeys[filteredKeys.length - 1]]
      : null

    setCurrentHeadingSlug(newCurrentHeadingSlug)
  }

  const updateHeadingsPosition = (): void => {
    const offsets = headings.reduce(
      (result: IHeadingsCoordinates, heading: IHeading) => {
        const headingElement = document.getElementById(heading.slug)

        if (headingElement?.offsetTop) {
          result[headingElement.offsetTop.toString()] = heading.slug
        }

        return result
      },
      {}
    )
    setHeadingsOffsets(offsets)
    setDocumentHeight(document.documentElement.clientHeight)
  }

  const initHeadingsPosition = (): void => {
    const root = document.querySelector('#markdown-root')

    root && allImagesLoadedInContainer(root).then(updateHeadingsPosition)
  }

  useEffect(() => {
    const throttledSetCurrentHeader = throttle(updateCurrentHeader, 100)

    document.addEventListener('scroll', throttledSetCurrentHeader)
    window.addEventListener('resize', updateHeadingsPosition)

    return (): void => {
      document.removeEventListener('scroll', throttledSetCurrentHeader)
      window.removeEventListener('resize', updateHeadingsPosition)
    }
  }, [updateCurrentHeader])
  useEffect(initHeadingsPosition, [headings])
  useEffect(updateCurrentHeader, [headingsOffsets, documentHeight])

  const contentBlockRef = useRef<HTMLDivElement>(null)
  const [
    isScrollToCurrentHeadingHappened,
    setIsScrollToCurrentHeadingHappened
  ] = useState(false)
  useEffect(() => {
    if (isScrollToCurrentHeadingHappened) {
      return
    }
    if (!document.location.hash) {
      setIsScrollToCurrentHeadingHappened(true)
      return
    }
    if (currentHeadingSlug) {
      setIsScrollToCurrentHeadingHappened(true)
      const currentHeadingSlugElem = document.getElementById(
        `link-${currentHeadingSlug}`
      )
      const contentBlockElem = contentBlockRef.current
      if (currentHeadingSlugElem && contentBlockElem) {
        const hasVerticalScrollbar =
          contentBlockElem.scrollHeight > contentBlockElem.clientHeight
        if (hasVerticalScrollbar) {
          currentHeadingSlugElem.scrollIntoView({
            block: 'start',
            inline: 'nearest'
          })
        }
      }
    }
  })

  return (
    <div className={styles.container}>
      {headings.length > 0 && (
        <>
          <div>
            <h5 className={styles.header}>Content</h5>
            <hr className={styles.separator} />
          </div>
          <div className={styles.contentBlock} ref={contentBlockRef}>
            {headings.map(({ slug, text }) => (
              <div id={`link-${slug}`} key={`link-${slug}`}>
                <Link
                  className={cn(
                    styles.headingLink,
                    currentHeadingSlug === slug && styles.current,
                    'link-with-focus'
                  )}
                  href={`#${slug}`}
                >
                  {text}
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
      <div className={styles.buttonsBlock}>
        {Object.keys(tutorials || {}).length > 0 && (
          <div className={styles.buttonSection}>
            <p className={styles.buttonSectionDescription}>
              <span
                className={styles.buttonSectionIcon}
                role="img"
                aria-label="run"
              >
                ▶️
              </span>{' '}
              It can be run online:
            </p>
            <Tutorials
              buttonClassName={cn(styles.button, styles.tutorials)}
              tutorials={tutorials}
            />
          </div>
        )}
        <div className={styles.buttonSection}>
          <p className={styles.buttonSectionDescription}>
            <span
              className={styles.buttonSectionIcon}
              role="img"
              aria-label="bug"
            >
              🐛
            </span>{' '}
            Found an issue? Let us know! Or fix it:
          </p>

          <Link
            className={cn(sharedStyles.button, styles.button)}
            href={githubLink}
            target="_blank"
          >
            <i className={cn(sharedStyles.buttonIcon, styles.githubIcon)} />
            Edit on GitHub
          </Link>
        </div>

        <div className={styles.buttonSection}>
          <p className={styles.buttonSectionDescription}>
            <span
              className={styles.buttonSectionIcon}
              role="img"
              aria-label="question"
            >
              ❓
            </span>{' '}
            Have a question? Join our chat, we will help you:
          </p>

          <Link
            className={cn(sharedStyles.button, styles.button)}
            href="/chat"
            target="_blank"
          >
            <i className={cn(sharedStyles.buttonIcon, styles.discordIcon)} />
            Discord Chat
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RightPanel
