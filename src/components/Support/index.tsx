import cn from 'classnames'

import LayoutWidthContainer from '@dvcorg/gatsby-theme/src/components/LayoutWidthContainer'
import Link from '@dvcorg/gatsby-theme/src/components/Link'
import ShowOnly from '@dvcorg/gatsby-theme/src/components/ShowOnly'

import HeroContainer from '../HeroContainer'
import PageContent from '../PageContent'
import PromoSection from '../PromoSection'

import Popover from './Popover'
import * as styles from './styles.module.css'

const SupportPage: React.FC = () => (
  <>
    <PageContent>
      <HeroContainer className={styles.supportHero}>
        <h1 className={styles.heading}>
          Questions, feedback, or just need to get in touch?
        </h1>
      </HeroContainer>
      <LayoutWidthContainer>
        <div className={styles.features}>
          <div className={cn(styles.feature, styles.chat)}>
            <div className={styles.featureHeader}>
              <div className={styles.featureIcon} />
              <h3 className={styles.featureName}>Slack-like Chat</h3>
            </div>
            <div className={styles.featureDescription}>
              Join data science practitioners in our welcoming{' '}
              <span className={styles.accent}>DVC Community</span>. It’s the
              fastest way to get help.
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
                      style={{ border: 0 }}
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
              <h3 className={styles.featureName}>Bugs & Feature Requests</h3>
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
          {/* <div className={cn(styles.feature, styles.email)}> */}
          {/*   <div className={styles.featureHeader}> */}
          {/*     <div className={styles.featureIcon} /> */}
          {/*     <h3 className={styles.featureName}>Email</h3> */}
          {/*   </div> */}
          {/*   <div className={styles.featureDescription}> */}
          {/*     Email us at{' '} */}
          {/*     <Link className={styles.accent} href="mailto:support@dvc.org"> */}
          {/*       support@dvc.org */}
          {/*     </Link> */}
          {/*     . For help with debugging DVC commands, run the commands with the{' '} */}
          {/*     <span className={styles.accent}>--verbose</span> flag and include */}
          {/*     the output if possible. */}
          {/*   </div> */}
          {/*   <div className={styles.featureFooter}> */}
          {/*     <Link */}
          {/*       className={styles.featureButton} */}
          {/*       href="mailto:support@dvc.org" */}
          {/*     > */}
          {/*       Drop Us a Line */}
          {/*     </Link> */}
          {/*   </div> */}
          {/* </div> */}
        </div>
      </LayoutWidthContainer>
    </PageContent>
    <PromoSection
      title="Don't know where to start?"
      buttons={[
        <Link href="/start" key="get-started">
          Get Started
        </Link>
      ]}
    />
  </>
)

export default SupportPage
