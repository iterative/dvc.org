import React, { useCallback } from 'react'
import cn from 'classnames'
import format from 'date-fns/format'

import { ICommunitySectionTheme } from '../'
import LayoutWidthContainer from '../../LayoutWidthContainer'
import Link from '../../Link'
import Block from '../Block'
import Section from '../Section'
import { logEvent } from '../../../utils/front/ga'
import { useCommunityData } from '../../../utils/front/community'

import sharedStyles from '../styles.module.css'
import styles from './styles.module.css'

export interface IEvent {
  theme: ICommunitySectionTheme
  city: string
  date: string
  description: string
  pictureUrl?: string
  title: string
  url: string
}

const Event: React.FC<IEvent> = ({
  theme,
  city,
  date,
  description,
  pictureUrl,
  title,
  url
}) => {
  const logEventClick = useCallback(
    () => logEvent('community', 'event', title),
    [title]
  )

  return (
    <Block
      action={
        <Link
          className={sharedStyles.button}
          style={theme}
          href={url}
          target="_blank"
          onClick={logEventClick}
        >
          Event Info
        </Link>
      }
    >
      <Link
        className={styles.imageWrapper}
        href={url}
        target="_blank"
        onClick={logEventClick}
      >
        <img
          className={styles.image}
          src={pictureUrl || '/img/community/event-placeholder.svg'}
          alt=""
        />
      </Link>

      <Link
        className={sharedStyles.link}
        style={{ color: theme.color }}
        href={url}
        target="_blank"
        onClick={logEventClick}
      >
        {title}
      </Link>
      <div className={cn(sharedStyles.meta, styles.meta)}>
        <div className={sharedStyles.line}>{description}</div>
        <div className={sharedStyles.line}>
          {city}, {format(new Date(date), 'MMMM d')}
        </div>
      </div>
    </Block>
  )
}

const Events: React.FC<{ theme: ICommunitySectionTheme }> = ({ theme }) => {
  const {
    events,
    rest: {
      section: {
        events: { description, mobileDescription, title }
      }
    }
  } = useCommunityData()

  return (
    <LayoutWidthContainer className={sharedStyles.wrapper}>
      <Section
        anchor="events"
        color={theme.color}
        description={description}
        icon="/img/community/events.svg"
        mobileDescription={mobileDescription}
        title={title}
      >
        <div className={sharedStyles.items}>
          {events ? (
            events.map((event, key) => (
              <div className={sharedStyles.item} key={key}>
                {event && <Event {...event} theme={theme} key={event.url} />}
              </div>
            ))
          ) : (
            <div className={styles.eventsPlaceholder}>
              No upcoming events. Subscribe to be up to date!{' '}
              <span role="img" aria-label="Subscribe below">
                👇
              </span>
            </div>
          )}
        </div>
      </Section>
    </LayoutWidthContainer>
  )
}

export default Events
