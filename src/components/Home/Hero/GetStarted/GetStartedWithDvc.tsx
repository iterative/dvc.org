import React from 'react'
import HeroContainer from '../../../HeroContainer'
import { StaticImage } from 'gatsby-plugin-image'
import { cn } from '../../../../utils'

import TwoRowsButtonLink from '../../../TwoRowsButton/link'

import DownloadButton from '../../../DownloadButton'

import DvcSlides from '../../LandingHero/DvcSlides'

import * as styles from './styles.module.css'

import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'
import ShowOnly from '@dvcorg/gatsby-theme-iterative/src/components/ShowOnly'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'

const logUseCasesEvent = () => {
  logEvent('Button', { Item: 'how-it-works' })
}

const logVSCodeEvent = () => {
  logEvent('Button', { Item: 'vscode-dvc-ext' })
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
      mode="vscode"
      className={styles.actionButton}
      title="DVC For VS Code"
      description="Get VS Code Extension"
      icon={
        <img
          className={styles.actionButtonIcon}
          src="/img/vscode-alt-icon.svg"
          alt="Get VS Code Extension"
        />
      }
      onClick={logVSCodeEvent}
      href="https://marketplace.visualstudio.com/items?itemName=Iterative.dvc"
    />
    <TwoRowsButtonLink
      mode="outline"
      className={cn(
        styles.actionButton,
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

const GetStartedWithDvc = () => {
  return (
    <HeroContainer className="py-10 px-6" id="get-started-dvc">
      <div className="flex items-center gap-4 md:justify-center">
        <h1 className={cn('text-2xl font-medium')}>Get Started with</h1>
        <StaticImage
          height={48}
          src="../../../../../static/img/dvc_icon-color--square_vector.svg"
          alt="DVC Logo"
        />
      </div>
      <DvcSlides />
      <HeroButtons />
    </HeroContainer>
  )
}

export default GetStartedWithDvc
