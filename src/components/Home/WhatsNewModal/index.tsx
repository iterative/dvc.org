/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useState } from 'react'
import cn from 'classnames'
import FocusLock from 'react-focus-lock'

import Video from '../UseCases/Video'
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
            <h2 className={styles.title}>Experiment Versioning</h2>
            <Video id="UbL7VUpv1Bs" />
            <p className={styles.text}>
              Versioning ML experiments combines the benefits of version control
              and experiment tracking. <Link href="/blog">Read more</Link>
            </p>
          </div>
        </div>
      </div>
    </FocusLock>
  )
}

export default WhatsNewModal
