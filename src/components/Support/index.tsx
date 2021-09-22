import React from 'react'
import cn from 'classnames'

import PageContent from '../PageContent'
import LayoutWidthContainer from '../LayoutWidthContainer'
import ShowOnly from '../ShowOnly'
import HeroSection from '../HeroSection'
import PromoSection from '../PromoSection'
import Link from '../Link'
import Popover from './Popover'

import styles from './styles.module.css'

const SupportPage: React.FC = () => (
  <>
    <PageContent>
      <HeroSection className={styles.supportHero}>
        <h1 className={styles.heading}>
          Questions, feedback, or just need to get in touch?
        </h1>
      </HeroSection>
      <LayoutWidthContainer>
        <div className={styles.features}>
          <div className={cn(styles.feature, styles.chat)}>
            <div className={styles.featureHeader}>
              <div className={styles.featureIcon} />
              <h3 className={styles.featureName}>Slack-like Chat</h3>
            </div>
            <div className={styles.featureDescription}>
              Join data science practitioners in our welcoming{' '}
              <span className={styles.accent}>DVC community</span>. It’s the
              fastest way to ask for a help.
            </div>
            <div className={styles.featureFooter}>
              <Link
                className={styles.featureButton}
                href="/chat"
                target="_blank"
              >
                Discord Chat
              </Link>
              <ShowOnly on="desktop">
                <Popover
                  body={
                    <iframe
                      title="Discord Members Online"
                      src="https://discordapp.com/widget?id=485586884165107732&theme=light"
                      width="350"
                      height="500"
                      allowTransparency
                      frameBorder="0"
                    />
                  }
                  enterExitTransitionDurationMs={200}
                >
                  <div className={styles.discordWidget} />
                </Popover>
              </ShowOnly>
            </div>
          </div>
          <div className={cn(styles.feature, styles.bugs)}>
            <div className={styles.featureHeader}>
              <div className={styles.featureIcon} />
              <h3 className={styles.featureName}>Bugs & Features</h3>
            </div>
            <div className={styles.featureDescription}>
              Found an issue or have an idea? Check our GitHub{' '}
              <span className={styles.accent}>issues tracker</span> to see if
              there is already a fix or report a new one.
            </div>
            <div className={styles.featureFooter}>
              <Link
                className={styles.featureButton}
                href="https://github.com/iterative/dvc/issues"
                target="_blank"
              >
                Open GitHub
              </Link>
            </div>
          </div>
          <div className={cn(styles.feature, styles.forum)}>
            <div className={styles.featureHeader}>
              <div className={styles.featureIcon} />
              <h3 className={styles.featureName}>Forum</h3>
            </div>
            <div className={styles.featureDescription}>
              Discuss your ideas or{' '}
              <span className={styles.accent}>best practices</span> in the DVC
              forum.
            </div>
            <div className={styles.featureFooter}>
              <Link
                className={styles.featureButton}
                href="https://discuss.dvc.org"
                target="_blank"
              >
                Go To Forum
              </Link>
            </div>
          </div>
          <div className={cn(styles.feature, styles.email)}>
            <div className={styles.featureHeader}>
              <div className={styles.featureIcon} />
              <h3 className={styles.featureName}>Email</h3>
            </div>
            <div className={styles.featureDescription}>
              Don’t hesitate to shoot us an email at{' '}
              <Link className={styles.accent} href="mailto:support@dvc.org">
                support@dvc.org
              </Link>{' '}
              with any questions.
            </div>
            <div className={styles.featureFooter}>
              <Link
                className={styles.featureButton}
                href="mailto:support@dvc.org"
              >
                Drop Us a Line
              </Link>
            </div>
          </div>
        </div>
      </LayoutWidthContainer>
    </PageContent>
    <PromoSection
      title="Don't know where to start?"
      buttons={[
        <Link href="/doc/start" key="get-started">
          Get Started
        </Link>
      ]}
    />
  </>
)

export default SupportPage
