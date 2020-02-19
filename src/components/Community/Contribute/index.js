import React from 'react'
import PropTypes from 'prop-types'

import { logEvent } from '../../../utils/ga'

import CommunityButton from '../Button'
import CommunityBlock from '../Block'
import CommunitySection from '../Section'

import data from '../data'

import { Item, Items, Wrapper } from '../styles'

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
        background="/static/img/community/contribute_bg.jpg"
        color={theme.color}
        description={description}
        icon="/static/img/community/contribute.svg"
        mobileDescription={mobileDescription}
        title={title}
      >
        <Items>
          <Item>
            <CommunityBlock
              title="Make a PR"
              action={
                <CommunityButton
                  theme={theme}
                  href="https://github.com/iterative/dvc"
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={logPR}
                >
                  Go to Github
                </CommunityButton>
              }
            >
              Become DVC contributor and let us build something great together.
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title="Write a blogpost"
              action={
                <CommunityButton
                  theme={theme}
                  href="mailto:info@dvc.org?subject=I want to write a blogpost!"
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={logBlogpost}
                >
                  Let’s talk!
                </CommunityButton>
              }
            >
              Have something cool on your mind? Suggest a text and we&apos;ll
              publish it in our blog.
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title="Give a talk"
              action={
                <CommunityButton
                  theme={theme}
                  href="mailto:info@dvc.org?subject=I want to give a talk!"
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={logTalk}
                >
                  Let’s talk!
                </CommunityButton>
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
                <CommunityButton
                  theme={theme}
                  // eslint-disable-next-line
                  href="mailto:info@dvc.org?subject=I want to become an Ambassador!"
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={logAmbassador}
                >
                  Let’s talk!
                </CommunityButton>
              }
            >
              Get perks and benefits for significant contributions, creating
              content or hosting meetups.
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
