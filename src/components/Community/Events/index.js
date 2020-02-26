import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import fill from 'lodash.fill'

import { logEvent } from '../../../utils/ga'

import CommunityBlock from '../Block'
import CommunitySection from '../Section'

import data from '../data'

import { Button, Item, Items, Line, Link, Wrapper } from '../styles'

import { Image, ImageWrapper, Meta } from './styles'

const { description, mobileDescription, title } = data.section.events
const { events } = data

const modifiedEvents = events.length > 3 ? events.slice(0, 3) : events
const eventPlaceholders = fill(new Array(3 - modifiedEvents.length), Item)

function CommunityEvent({
  theme,
  city,
  date,
  description,
  pictureUrl,
  title,
  url
}) {
  const logEventClick = useCallback(
    () => logEvent('community', 'event', title),
    [title]
  )

  return (
    <Item>
      <CommunityBlock
        action={
          <Button
            href={url}
            theme={theme}
            target="_blank"
            rel="noreferrer noopener"
            onClick={logEventClick}
          >
            Event Info
          </Button>
        }
      >
        <ImageWrapper
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          onClick={logEventClick}
        >
          <Image
            src={pictureUrl || '/img/community/event-placeholder.svg'}
            alt=""
          />
        </ImageWrapper>

        <Link
          color={theme.color}
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          onClick={logEventClick}
        >
          {title}
        </Link>
        <Meta>
          <Line>{description}</Line>
          <Line>
            {city}, {format(new Date(date), 'MMMM d')}
          </Line>
        </Meta>
      </CommunityBlock>
    </Item>
  )
}

CommunityEvent.propTypes = {
  theme: PropTypes.object,
  city: PropTypes.string,
  date: PropTypes.string,
  description: PropTypes.string,
  pictureUrl: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string
}

export default function CommunityEvents({ theme }) {
  if (!events.length) return ''

  return (
    <Wrapper>
      <CommunitySection
        anchor="events"
        color={theme.color}
        description={description}
        icon="/img/community/events.svg"
        mobileDescription={mobileDescription}
        title={title}
      >
        <Items>
          {modifiedEvents.map(event => (
            <CommunityEvent {...event} theme={theme} key={event.url} />
          ))}
          {eventPlaceholders.map((Component, key) => (
            <Component key={key} />
          ))}
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
