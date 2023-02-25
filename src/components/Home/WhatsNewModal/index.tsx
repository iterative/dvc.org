/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import cn from 'classnames'
import FocusLock from 'react-focus-lock'

import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'

import { ReactComponent as CloseSvg } from '../../../../static/img/close-icon.svg'

import * as styles from './styles.module.css'

const WhatsNewModal: React.FC = () => {
  const {
    allFeedIterativeBlog: {
      nodes: [latestPost]
    }
  } = useStaticQuery(query)
  const [isModalOpen, setIsModalOpen] = useState(false)
  let pageCloseEventListener: () => void = () => null
  let keyupCloseEventListener: () => void = () => null

  const closeModal = (): void => {
    setIsModalOpen(false)
    pageCloseEventListener()
    keyupCloseEventListener()
    document.body.style.overflow = 'visible'
  }

  const handleContainerClick = (event: MouseEvent): void => {
    const el = event.target as HTMLDivElement

    if (el.classList.contains(styles.container)) {
      closeModal()
    }
  }

  const handlePageKeyup = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }

  const setupModalEventListeners = (): void => {
    document.addEventListener('click', handleContainerClick)
    document.addEventListener('keyup', handlePageKeyup)

    pageCloseEventListener = (): void =>
      document.removeEventListener('click', handleContainerClick)
    keyupCloseEventListener = (): void =>
      document.removeEventListener('keyup', handlePageKeyup)
    document.body.style.overflow = 'hidden'
  }

  const handleButtonClick = (): void => {
    if (isModalOpen) {
      closeModal()
    } else {
      setupModalEventListeners()
      setIsModalOpen(true)
    }
  }

  useEffect(() => {
    return (): void => {
      document.body.style.overflow = 'visible'
    }
  }, [])

  return (
    <FocusLock disabled={!isModalOpen}>
      <div
        className={cn(styles.container, isModalOpen && styles.containerOpen)}
      >
        <div
          aria-label={"What's new"}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={handleButtonClick}
            className={cn(styles.button, isModalOpen && styles.buttonExit)}
          >
            {!isModalOpen && `What's new`}
            {isModalOpen && <CloseSvg width={20} height={20} />}
          </button>
          <div className={styles.modal}>
            <Link className={styles.title} href={latestPost.link}>
              <h2>{latestPost.title}</h2>
            </Link>
            {latestPost.picture && (
              <Link href={latestPost.link}>
                <GatsbyImage
                  className={styles.image}
                  alt=""
                  objectFit="contain"
                  image={latestPost.picture.childImageSharp.gatsbyImageData}
                />
              </Link>
            )}
            <p className={styles.text}>
              {latestPost.contentSnippet}{' '}
              <Link href={latestPost.link}>Read more.</Link>
            </p>
          </div>
        </div>
      </div>
    </FocusLock>
  )
}

export default WhatsNewModal

const query = graphql`
  query latestBlogPost {
    allFeedIterativeBlog(limit: 1, sort: { isoDate: DESC }) {
      nodes {
        title
        link
        pubDate
        picture {
          childImageSharp {
            gatsbyImageData(width: 420)
          }
        }
        contentSnippet
      }
    }
  }
`
