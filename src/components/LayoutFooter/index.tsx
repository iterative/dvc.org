import React from 'react'
import cn from 'classnames'

import LayoutWidthContainer from '../LayoutWidthContainer'
import Link from '../Link'
import SocialIcon from '../SocialIcon'
import ShowOnly from '../ShowOnly'
import { getFirstPage } from '../../utils/shared/sidebar'

import { ReactComponent as LogoSVG } from '../../../static/img/logo.svg'
import { ReactComponent as GithubSVG } from '../SocialIcon/github.svg'
import { ReactComponent as TwitterSVG } from '../SocialIcon/twitter.svg'
import { ReactComponent as DiscordSVG } from '../SocialIcon/discord.svg'
import { ReactComponent as CmlSVG } from '../../../static/img/cml-icon.svg'
import { ReactComponent as StudioSVG } from '../../../static/img/studio-icon.svg'
import { ReactComponent as IterativeSVG } from '../../../static/img/iterative-icon.svg'

import styles from './styles.module.css'

const docsPage = getFirstPage()

const LayoutFooter: React.FC = () => (
  <footer className={styles.wrapper}>
    <LayoutWidthContainer className={cn(styles.container)} wide>
      <div className={styles.top}>
        <Link className={styles.logo} href="/" title="dvc.org">
          <LogoSVG />
        </Link>
      </div>
      <div className={styles.columns}>
        <div className={styles.column}>
          <h2 className={styles.heading}>Product</h2>
          <ul className={styles.links}>
            <li className={styles.linkItem}>
              <Link href="/" className={styles.link}>
                Overview
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/features" className={styles.link}>
                Features
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h2 className={styles.heading}>Help</h2>
          <ul className={styles.links}>
            <li className={styles.linkItem}>
              <Link href="/support" className={styles.link}>
                Support
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/doc/start" className={styles.link}>
                Get started
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/community" className={styles.link}>
                Community
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href={docsPage} className={styles.link}>
                Documentation
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h2 className={styles.heading}>Community</h2>
          <ul className={styles.links}>
            <li className={styles.linkItem}>
              <Link
                href="https://twitter.com/DVCorg"
                className={styles.link}
                target="_blank"
              >
                <TwitterSVG className={styles.icon} />
                Twitter
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link
                href="https://github.com/iterative/dvc"
                className={styles.link}
                target="_blank"
              >
                <GithubSVG className={styles.icon} />
                GitHub
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/chat" className={styles.link}>
                <DiscordSVG className={styles.icon} />
                Discord
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h2 className={styles.heading}>Company</h2>
          <ul className={styles.links}>
            <li className={styles.linkItem}>
              <Link href="/blog" className={styles.link}>
                Blog
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/doc/user-guide/privacy" className={styles.link}>
                Privacy Policy
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link
                href="https://iterative.ai/about#career"
                target="_blank"
                className={styles.link}
              >
                Join us
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.column}>
          <h2 className={styles.heading}>Other Tools</h2>
          <ul className={styles.links}>
            <li className={styles.linkItem}>
              <Link target="_blank" href="/" className={styles.link}>
                <LogoSVG className={styles.productIcon} />
                DVC
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link
                target="_blank"
                href="https://cml.dev/"
                className={styles.link}
              >
                <CmlSVG className={styles.productIcon} />
                CML
              </Link>
            </li>
            <li className={styles.linkItem}>
              <Link
                href="https://studio.iterative.ai/"
                target="_blank"
                className={styles.link}
              >
                <StudioSVG className={styles.productIcon} />
                Studio
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <p className={styles.companyLabel}>
          By{' '}
          <Link
            className={styles.companyName}
            href="https://iterative.ai/"
            target="_blank"
          >
            <IterativeSVG className={styles.companyLogo} />
            iterative.ai
          </Link>
          <span className={styles.companyDescription}>
            <ShowOnly as="span" on="desktop">
              {' '}
              - an open platform to operationalize AI
            </ShowOnly>
            <ShowOnly as="span" on="mobile">
              {' '}
              An open platform to operationalize AI
            </ShowOnly>
          </span>
        </p>
        <div className={styles.socialIcons}>
          <SocialIcon
            site="github"
            label="DVC Github Page"
            url="https://github.com/iterative/dvc"
            className={cn(styles.link, styles.socialIcon)}
          />
          <SocialIcon
            site="twitter"
            label="DVC Twitter"
            url="https://twitter.com/DVCorg"
            className={cn(styles.link, styles.socialIcon)}
          />
          <SocialIcon
            site="youtube"
            label="DVC.org Youtube Channel"
            url="https://www.youtube.com/channel/UC37rp97Go-xIX3aNFVHhXfQ"
            className={cn(styles.link, styles.socialIcon)}
          />
          <SocialIcon
            site="linkedinNoBg"
            label="Iterative LinkedIn"
            url="https://www.linkedin.com/company/iterative-ai"
            className={cn(styles.link, styles.socialIcon)}
          />
          <SocialIcon
            site="discord"
            label="DVC Discord chat"
            url="https://www.dvc.org/chat"
            className={cn(styles.link, styles.socialIcon)}
          />
        </div>
      </div>
    </LayoutWidthContainer>
  </footer>
)

export default LayoutFooter
