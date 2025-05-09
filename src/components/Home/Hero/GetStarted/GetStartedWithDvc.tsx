import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import ShowOnly from '@dvcorg/gatsby-theme-iterative/src/components/ShowOnly'
import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'

import { cn } from '../../../../utils'
import DownloadButton from '../../../DownloadButton'
import HeroContainer from '../../../HeroContainer'
import TwoRowsButtonLink from '../../../TwoRowsButton/link'
import DvcSlides from '../../LandingHero/DvcSlides'

import * as styles from './styles.module.css'

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
  </div>
)

const GetStartedWithDvc = () => {
  return (
    <HeroContainer className="py-10 px-6" id="get-started-dvc">
      <div className="flex items-center md:justify-center">
        <h1 className={cn('text-2xl font-medium')}>Get Started with</h1>
        <img src="/img/logos/dvc.svg" alt="DVC Logo" className="h-12 ml-2" />
      </div>
      <DvcSlides />
      <HeroButtons />
    </HeroContainer>
  )
}

export default GetStartedWithDvc
