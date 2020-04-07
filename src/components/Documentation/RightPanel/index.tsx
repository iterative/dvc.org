import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import throttle from 'lodash.throttle'

import { IHeading } from '../'
import Link from '../../Link'
import Tutorials from '../TutorialsLinks'

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

const RightPanel: React.SFC<IRightPanelProps> = ({
  headings,
  tutorials,
  githubLink
}) => {
  const [height, setHeight] = useState(0)
  const [headingsOffsets, setHeadingsOffsets] = useState<IHeadingsCoordinates>(
    {}
  )
  const [current, setCurrent] = useState<string | null>(null)
  const setCurrentHeader = () => {
    const { scrollTop } = document.documentElement
    const coordinateKeys = Object.keys(headingsOffsets)

    if (!coordinateKeys.length) return

    const filteredKeys = coordinateKeys.filter(
      offsetTop => parseInt(offsetTop, 10) <= scrollTop + height / 2
    )

    const newCurrent = filteredKeys.length
      ? headingsOffsets[filteredKeys[filteredKeys.length - 1]]
      : null

    setCurrent(newCurrent)
  }

  const updateHeadingsPosition = () => {
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
    setHeight(document.documentElement.clientHeight)
    requestAnimationFrame(setCurrentHeader)
  }

  const initHeadingsPosition = () => {
    const root = document.querySelector('#markdown-root')

    root && allImagesLoadedInContainer(root).then(updateHeadingsPosition)
  }

  useEffect(() => {
    const throttledSetCurrentHeader = throttle(setCurrentHeader, 100)

    document.addEventListener('scroll', throttledSetCurrentHeader)
    window.addEventListener('resize', updateHeadingsPosition)

    return () => {
      document.removeEventListener('scroll', throttledSetCurrentHeader)
      window.removeEventListener('resize', updateHeadingsPosition)
    }
  }, [setCurrentHeader])
  useEffect(initHeadingsPosition, [headings])

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {headings.length > 0 && (
          <>
            <h5 className={styles.header}>Content</h5>
            <hr className={styles.separator} />
          </>
        )}
        {headings.map(({ slug, text }) => (
          <Link
            className={cn(
              styles.headingLink,
              current === slug && styles.current
            )}
            key={`link-${slug}`}
            href={`#${slug}`}
          >
            {text}
          </Link>
        ))}
      </div>
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
  )
}

export default RightPanel
