import React from 'react'

import CommunitySection from '../Section'

import data from '../data'

import { Wrapper } from './styles'

const { color, description, icon, title } = data.section.contribute

export default function CommunityContribute() {
  return (
    <CommunitySection
      color={color}
      description={description}
      icon={icon}
      title={title}
    >
      <Wrapper>
        <div>
          <div>Make a PR</div>
          <div>
            Help us to improve our product and become a core team member.
          </div>
          <a href="/">Open Chat</a>
        </div>
        <div>
          <div>Write a blogpost</div>
          <div>
            Have something cool on your mind? Suggest a text and we&apos;ll
            publish it in our blog.
          </div>
          <a href="/">Learn More</a>
        </div>
        <div>
          <div>Give a talk</div>
          <div>
            We support all community members giving talks about DVC
            implementation in their projects.
          </div>
          <a href="/">Learn More</a>
        </div>
        <div>
          <div>Be an Ambassador</div>
          <div>Spread news about DVC among lost souls!</div>
          <a href="/">Apply</a>
        </div>
      </Wrapper>
    </CommunitySection>
  )
}
