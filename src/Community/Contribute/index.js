import React from 'react'
import PropTypes from 'prop-types'

import CommunityButton from '../Button'
import CommunityBlock from '../Block'
import CommunitySection from '../Section'

import data from '../data'

import { Item, Items, Wrapper } from './styles'

const { description, icon, title } = data.section.contribute

export default function CommunityContribute({ theme }) {
  return (
    <Wrapper>
      <CommunitySection
        color={theme.color}
        description={description}
        icon={icon}
        title={title}
      >
        <Items>
          <Item>
            <CommunityBlock
              title="Make a PR"
              action={
                <CommunityButton theme={theme} href="/">
                  Open Chat
                </CommunityButton>
              }
            >
              Help us to improve our product and become a core team member.
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title="Write a blogpost"
              action={
                <CommunityButton theme={theme} href="/">
                  Learn More
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
                <CommunityButton theme={theme} href="/">
                  Learn More
                </CommunityButton>
              }
            >
              We support all community members giving talks about DVC
              implementation in their projects.
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title="Be an Ambassador"
              action={
                <CommunityButton theme={theme} href="/">
                  Apply
                </CommunityButton>
              }
            >
              Spread news about DVC among lost souls!
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
