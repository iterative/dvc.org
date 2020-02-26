import React from 'react'
import PropTypes from 'prop-types'

import { logEvent } from '../../../utils/ga'

import CommunityBlock from '../Block'
import CommunitySection from '../Section'

import data from '../data'

import { Button, Item, Items, Wrapper } from '../styles'

const { description, mobileDescription, title } = data.section.contribute

const logPR = () => logEvent('community', 'contribute-pr')
const logBlogpost = () => logEvent('community', 'contribute-blogpost')
const logTalk = () => logEvent('community', 'contribute-talk')
const logAmbassador = () => logEvent('community', 'contribute-ambassador')

export default function CommunityContribute({ theme }) {
  return (
    <Wrapper>
      <CommunitySection
        anchor="contribute"
        background="/img/community/contribute_bg.jpg"
        color={theme.color}
        description={description}
        icon="/img/community/contribute.svg"
        mobileDescription={mobileDescription}
        title={title}
      >
        <Items>
          <Item>
            <CommunityBlock
              title="Make a PR"
              action={
                <Button
                  theme={theme}
                  href="https://github.com/iterative/dvc"
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={logPR}
                >
                  Go to Github
                </Button>
              }
            >
              Let&apos;s build something great together. Become a DVC
              contributor!.
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title="Write a blogpost"
              action={
                <Button
                  theme={theme}
                  href="mailto:info@dvc.org?subject=I want to write a blogpost!"
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={logBlogpost}
                >
                  Let’s talk!
                </Button>
              }
            >
              We&apos;re always interested in guest writers for our blog. If you
              have something to share, please reach out!
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title="Give a talk"
              action={
                <Button
                  theme={theme}
                  href="mailto:info@dvc.org?subject=I want to give a talk!"
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={logTalk}
                >
                  Let’s talk!
                </Button>
              }
            >
              We support speakers all over the world and help with preparation,
              speaker training and expenses.
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title="Be an Ambassador"
              action={
                <Button
                  theme={theme}
                  // eslint-disable-next-line
                  href="mailto:info@dvc.org?subject=I want to become an Ambassador!"
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={logAmbassador}
                >
                  Let’s talk!
                </Button>
              }
            >
              Get perks and benefits for contributing to the code base, writing
              blog posts, or hosting meetups.
            </CommunityBlock>
          </Item>
        </Items>
      </CommunitySection>
    </Wrapper>
  )
}

CommunityContribute.propTypes = {
  theme: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string
  })
}
