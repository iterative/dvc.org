import { useState, useCallback, useEffect } from 'react'

import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'
import safeLocalStorage from '@dvcorg/gatsby-theme-iterative/src/utils/front/safeLocalStorage'

import TwoRowsButton from '../../../TwoRowsButton'

import * as styles from './styles.module.css'

const Video: React.FC<{ id: string }> = ({ id }) => {
  const [isWatching, setWatching] = useState(false)
  const [hasUserGivenConsent, setHasUserGivenConsent] = useState(false)

  useEffect(() => {
    const givenConsent = Boolean(safeLocalStorage.getItem('yt-embed-consent'))

    setHasUserGivenConsent(givenConsent)
  }, [])

  const watchVideo = useCallback(() => {
    logEvent('Button', { Item: 'video' })
    setWatching(true)
    safeLocalStorage.setItem('yt-embed-consent', 'true')
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.handler}>
        {!isWatching && (
          <div className={styles.overlay}>
            <div className={styles.content}>
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
              {!hasUserGivenConsent && (
                <div className={styles.tooltip}>
                  By clicking play, you agree to YouTube&apos;s{' '}
                  <Link href="https://policies.google.com/u/3/privacy?hl=en">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link href="https://www.youtube.com/static?template=terms">
                    Terms of Service
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        <iframe
          title="Video"
          width="560"
          height="315"
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&amp;controls=0&amp;showinfo=0;${
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
