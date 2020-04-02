import React, { useState, useCallback } from 'react'

import { logEvent } from '../../../../utils/ga'

import styles from './styles.module.css'

const Video: React.SFC<{ id: string }> = ({ id }) => {
  const [isWatching, setWatching] = useState(false)

  const watchVideo = useCallback(() => {
    logEvent('button', 'video')
    setWatching(true)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.handler}>
        {!isWatching && (
          <div className={styles.overlay}>
            <button className={styles.button} onClick={watchVideo}>
              <img
                className={styles.buttonIcon}
                src="/img/watch_white.svg"
                alt="Watch video"
                width={20}
                height={20}
              />
              <span>
                <span className={styles.buttonText}>Watch video</span>
                <span className={styles.buttonDescription}>How it works</span>
              </span>
            </button>
          </div>
        )}
        <iframe
          title="Video"
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${id}?rel=0&amp;controls=0&amp;showinfo=0;${
            isWatching ? `&autoplay=1` : ''
          }`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  )
}

export default Video
