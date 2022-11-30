import React, { useEffect, useState } from 'react'
import cn from 'classnames'

import ShowOnly from '@dvcorg/gatsby-theme-iterative/src/components/ShowOnly'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import DownloadButton from '../../DownloadButton'
import TwoRowsButtonLink from '../../TwoRowsButton/link'
import GithubLine from './GithubLine'
import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'

import * as styles from './styles.module.css'

const logUseCasesEvent = () => {
  logEvent('Button', { Item: 'how-it-works' })
}

const LandingHero = () => {
  const [activeCommand, setActiveCommand] = useState(0)

  useEffect(() => {
    const interval = setInterval(
      () => setActiveCommand(prev => (prev + 1) % 4),
      3000
    )

    return (): void => clearInterval(interval)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.about}>
        <h1 className={styles.title}>
          Open-source
          <br />
          Version Control System
          <br />
          for Machine Learning Projects
        </h1>
        <div className={styles.buttonsContainer}>
          <ShowOnly on="mobile">
            <Link
              className={cn(styles.actionButton, styles.getStartedButton)}
              href="/doc/start"
            >
              Get started
            </Link>
          </ShowOnly>
          <ShowOnly on="desktop">
            <DownloadButton />
          </ShowOnly>
          <TwoRowsButtonLink
            mode="outline"
            className={`${cn(
              styles.actionButton,
              styles.watchVideo
            )} btn-with-focus btn-with-focus--white`}
            title="Watch video"
            description="How it works"
            icon={
              <img
                className={styles.actionButtonIcon}
                src="/img/play-icon.svg"
                alt="Watch video"
              />
            }
            onClick={logUseCasesEvent}
            href="#use-cases"
          />
        </div>

        <div className={styles.github}>
          <GithubLine />
        </div>
      </div>

      <ShowOnly on="desktop">
        <div className={styles.commands}>
          <div
            className={cn(styles.command, activeCommand === 0 && styles.active)}
          >
            <span className={styles.line}>$ dvc add images</span>
          </div>
          <div
            className={cn(styles.command, activeCommand === 1 && styles.active)}
          >
            <span className={styles.line}>
              $ dvc run -d images -o model.p cnn.py
            </span>
          </div>
          <div
            className={cn(styles.command, activeCommand === 2 && styles.active)}
          >
            <span className={styles.line}>
              $ dvc remote add -d myrepo s3://mybucket
            </span>
          </div>
          <div
            className={cn(styles.command, activeCommand === 3 && styles.active)}
          >
            <span className={styles.line}>$ dvc push</span>
          </div>
        </div>
      </ShowOnly>
    </div>
  )
}

export default LandingHero
