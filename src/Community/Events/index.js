import React from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'

import CommunityBlock from '../Block'
import CommunitySection from '../Section'

import data from '../data'

import { Image, ImageWrapper, Item, Items, Wrapper } from './styles'

const { description, icon, title } = data.section.events
const { events } = data

const modifiedEvents = events.length > 3 ? events.slice(0, 3) : events
const eventPlaceholders = new Array(3 - modifiedEvents.length).fill(<Item />)

export default function CommunityEvents({ theme }) {
  return (
    <Wrapper>
      <CommunitySection
        color={theme.color}
        description={description}
        icon={icon}
        title={title}
      >
        <Items>
          {modifiedEvents.map(
            ({ url, title, description, date, city, picture }) => (
              <Item key={url}>
                <CommunityBlock>
                  {picture && (
                    <ImageWrapper href={url}>
                      <Image src={picture} alt="" />
                    </ImageWrapper>
                  )}
                  <a href={url}>{title}</a>
                  <div>{description}</div>
                  <div>{city}</div>
                  <div>{format(date, 'MMMM, d')}</div>
                </CommunityBlock>
              </Item>
            )
          )}
          {eventPlaceholders.map(i => i)}
        </Items>
      </CommunitySection>
    </Wrapper>
  )
}

CommunityEvents.propTypes = {
  theme: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string
  })
}
