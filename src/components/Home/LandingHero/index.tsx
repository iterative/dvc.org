import cn from 'classnames'

import Link from '@dvcorg/gatsby-theme/src/components/Link'
import ShowOnly from '@dvcorg/gatsby-theme/src/components/ShowOnly'
import { logEvent } from '@dvcorg/gatsby-theme/src/utils/front/plausible'

import DownloadButton from '../../DownloadButton'
import TwoRowsButtonLink from '../../TwoRowsButton/link'

import DvcSlides from './DvcSlides'
import GithubLine from './GithubLine'
import * as styles from './styles.module.css'

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

const LandingHero = () => {
  return (
    <div className={cn('text-gray-hover')}>
      <h1
        className={cn(
          'text-3xl',
          'sm:text-4xl',
          'md:text-5xl',
          'font-semibold',
          'my-4',
          'text-purple'
        )}
      >
        <span className={cn('whitespace-nowrap')}>(Not Just)</span>{' '}
        <span className={cn('whitespace-nowrap')}>Data Version Control</span>
      </h1>
      <p className={cn('text-xl', 'my-4')}>
        Open-source, Git-based data science. Apply version control to machine
        learning development, make your repo the backbone of your project, and
        instill best practices across your team.
      </p>
      <DvcSlides />
      <HeroButtons />
      <div className={styles.github}>
        <GithubLine />
      </div>
    </div>
  )
}

export default LandingHero
