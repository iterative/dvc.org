import React from 'react'

import { ICommunitySectionTheme } from '../'
import LayoutWidthContainer from '../../LayoutWidthContainer'
import Link from '../../Link'
import CommunityBlock from '../Block'
import CommunitySection from '../Section'
import { logEvent } from '../../../utils/front/ga'

import { useCommunityData } from '../../../utils/front/community'
import sharedStyles from '../styles.module.css'

const logPR = (): void => logEvent('community', 'contribute-pr')
const logBlogpost = (): void => logEvent('community', 'contribute-blogpost')
const logTalk = (): void => logEvent('community', 'contribute-talk')
const logAmbassador = (): void => logEvent('community', 'contribute-ambassador')

const Contribute: React.FC<{ theme: ICommunitySectionTheme }> = ({ theme }) => {
  const {
    rest: {
      section: {
        contribute: { description, mobileDescription, title }
      }
    }
  } = useCommunityData()

  return (
    <LayoutWidthContainer className={sharedStyles.wrapper}>
      <CommunitySection
        anchor="contribute"
        background="/img/community/contribute_bg.jpg"
        color={theme.color}
        description={description}
        icon="/img/community/contribute.svg"
        mobileDescription={mobileDescription}
        title={title}
      >
        <div className={sharedStyles.items}>
          <div className={sharedStyles.item}>
            <CommunityBlock
              title="Make a PR"
              action={
                <Link
                  className={sharedStyles.button}
                  style={theme}
                  href="https://github.com/iterative/dvc"
                  target="_blank"
                  onClick={logPR}
                >
                  Go to Github
                </Link>
              }
            >
              Let&apos;s build something great together. Become a DVC
              contributor!.
            </CommunityBlock>
          </div>
          <div className={sharedStyles.item}>
            <CommunityBlock
              title="Write a blogpost"
              action={
                <Link
                  className={sharedStyles.button}
                  style={theme}
                  href="mailto:info@dvc.org?subject=I want to write a blogpost!"
                  target="_blank"
                  onClick={logBlogpost}
                >
                  Let’s talk!
                </Link>
              }
            >
              We&apos;re always interested in guest writers for our blog. If you
              have something to share, please reach out!
            </CommunityBlock>
          </div>
          <div className={sharedStyles.item}>
            <CommunityBlock
              title="Give a talk"
              action={
                <Link
                  className={sharedStyles.button}
                  style={theme}
                  href="mailto:info@dvc.org?subject=I want to give a talk!"
                  target="_blank"
                  onClick={logTalk}
                >
                  Let’s talk!
                </Link>
              }
            >
              We support speakers all over the world and help with preparation,
              speaker training and expenses.
            </CommunityBlock>
          </div>
          <div className={sharedStyles.item}>
            <CommunityBlock
              title="Be an Ambassador"
              action={
                <Link
                  className={sharedStyles.button}
                  style={theme}
                  href="/blog/dvc-ambassador-program-announcement"
                  onClick={logAmbassador}
                >
                  Learn more!
                </Link>
              }
            >
              Get perks and benefits for contributing to the code base, writing
              blog posts, or hosting meetups.
            </CommunityBlock>
          </div>
        </div>
      </CommunitySection>
    </LayoutWidthContainer>
  )
}

export default Contribute
