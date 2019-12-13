import React from 'react'
import format from 'date-fns/format'

import CommunitySection from '../Section'

import data from '../data'

import { Wrapper } from './styles'

const { color, description, icon, title } = data.section.events
const { events } = data

export default function CommunityEvents() {
  return (
    <CommunitySection
      color={color}
      description={description}
      icon={icon}
      title={title}
    >
      <Wrapper>
        {events.map(({ url, title, description, date, city, picture }) => (
          <div key={url}>
            {picture && (
              <div>
                <img src={picture} alt="" />
              </div>
            )}
            <a href={url}>{title}</a>
            <div>{description}</div>
            <div>{city}</div>
            <div>{format(date, 'MMMM, d')}</div>
          </div>
        ))}
      </Wrapper>
    </CommunitySection>
  )
}
