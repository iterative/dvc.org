import React, { useState } from 'react'
import cn from 'classnames'
import ReactMarkdown from 'react-markdown'

import Portal from '../Portal'

import styles from './styles.module.css'

interface IMobileViewProps {
  description: string
  header: string
  text: React.ReactNode
}

const MobileView: React.SFC<IMobileViewProps> = ({
  description,
  header,
  text
}) => {
  const [isVisible, setVisible] = useState(false)
  const openTooltip = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    setVisible(true)
  }
  const onOpenKeyDown = (e: React.KeyboardEvent) => {
    if (e.which === 13 || e.which === 32) {
      setVisible(true)
    }
  }
  const closeTooltip = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setVisible(false)
  }
  const onCloseKeyDown = (e: React.KeyboardEvent) => {
    if (e.which === 13 || e.which === 32) {
      setVisible(false)
    }
  }

  return (
    <>
      <span
        className={styles.highlightedText}
        onClick={openTooltip}
        onKeyDown={onOpenKeyDown}
        role="button"
        tabIndex={0}
      >
        {text}
      </span>
      {isVisible && (
        <Portal>
          {/* eslint-disable jsx-a11y/no-static-element-interactions*/}
          {/* eslint-disable jsx-a11y/click-events-have-key-events */}
          <div className={styles.modalBackground} onClick={closeTooltip}>
            {/* eslint-enable jsx-a11y/no-static-element-interactions*/}
            {/* eslint-enable jsx-a11y/click-events-have-key-events */}
            <div className={styles.modalContent}>
              <div
                className={styles.closeContainer}
                onClick={closeTooltip}
                onKeyPress={onCloseKeyDown}
                role="button"
                tabIndex={0}
              >
                <div className={cn(styles.closeLine, styles.first)} />
                <div className={cn(styles.closeLine, styles.second)} />
              </div>
              <h5 className={styles.modalHeader}>{header}</h5>
              <ReactMarkdown className="markdown-body" source={description} />
            </div>
          </div>
        </Portal>
      )}
    </>
  )
}

export default MobileView
