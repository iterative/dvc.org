import React from 'react'
import cn from 'classnames'

import TwoRowsButtonLink from '../../TwoRowsButton/link'
import GithubLine from './GithubLine'
import DownloadButton from '../../DownloadButton'

import * as styles from './styles.module.css'
import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'
import ShowOnly from '@dvcorg/gatsby-theme-iterative/src/components/ShowOnly'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import { HeroSlides } from './Slides'

const logUseCasesEvent = () => {
  logEvent('Button', { Item: 'how-it-works' })
}

const HeroButtons = () => (
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
      className={cn(
        styles.actionButton,
        styles.watchVideo,
        'btn-with-focus',
        'btn-with-focus--white'
      )}
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
)

const LandingHero = () => {
  return (
    <div className={cn('my-14', 'text-gray-hover')}>
      <h1 className={cn('text-4xl', 'font-medium', 'mt-4', 'mb-8')}>
        (Not Just) Data Version Control
      </h1>
      <HeroSlides />
      <HeroButtons />
      <div className={styles.github}>
        <GithubLine />
      </div>
    </div>
  )
}

export default LandingHero
