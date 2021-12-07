/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useEffect, useState } from 'react'
import { StaticImage } from 'gatsby-plugin-image'
import cn from 'classnames'
import FocusLock from 'react-focus-lock'

import Link from '../../Link'

import { ReactComponent as CloseSvg } from '../../../../static/img/close-icon.svg'

import * as styles from './styles.module.css'

const WhatsNewModal: React.FC = () => {
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
            <Link
              className={styles.title}
              href="/blog/ml-experiment-versioning"
            >
              <h2>ML Experiment Versioning</h2>
            </Link>
            <Link href="/blog/ml-experiment-versioning">
              <StaticImage
                alt="a description of blog image"
                src="../../../../static/uploads/images/2021-12-07/experiment-versioning-cover.png"
                className={styles.image}
                width={420}
                objectFit="contain"
              />
            </Link>
            <p className={styles.text}>
              Versioning machine learning experiments combines the benefits of
              version control and experiment tracking.{' '}
              <Link href="/blog/ml-experiment-versioning">Read more.</Link>
            </p>
          </div>
        </div>
      </div>
    </FocusLock>
  )
}

export default WhatsNewModal
