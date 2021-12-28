import React, { useState, useCallback, useRef } from 'react'

import TwoRowsButton from '../../../TwoRowsButton'
import { logEvent } from '../../../../utils/front/plausible'

import * as styles from './styles.module.css'

const Video: React.FC<{ id: string }> = ({ id }) => {
  const [isWatching, setWatching] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>()

  const watchVideo = useCallback(() => {
    logEvent('Button', { Item: 'video' })
    setWatching(true)
    if (iframeRef.current) {
      iframeRef.current.src = `https://www.youtube.com/embed/${id}?rel=0&amp;controls=0&amp;showinfo=0;&autoplay=1`
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.handler}>
        {!isWatching && (
          <div className={styles.overlay}>
            <TwoRowsButton
              mode="azure"
              title="Watch video"
              description="How it works"
              icon={
                <img
                  className={styles.buttonIcon}
                  src="/img/watch_white.svg"
                  alt="Watch video"
                />
              }
              onClick={watchVideo}
            />
          </div>
        )}
        <iframe
          ref={iframeElement => {
            iframeRef.current = iframeElement
          }}
          title="Video"
          width="560"
          height="315"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  )
}

export default Video
