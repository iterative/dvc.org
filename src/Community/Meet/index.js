import React from 'react'
import PropTypes from 'prop-types'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import CommunityBlock from '../Block'
import CommunityButton from '../Button'
import CommunitySection from '../Section'

import { pluralizeComments } from '../../utils/i18n'

import data from '../data'

const { description, title } = data.section.meet

import { StatLabel, StatLine, StatValue } from './styles'

import {
  Comments,
  Item,
  Items,
  Line,
  Link,
  Meta,
  Placeholder,
  Wrapper
} from '../styles'

export default function CommunityMeet({ issues, theme, topics }) {
  return (
    <Wrapper>
      <CommunitySection
        anchor="meet"
        background="/static/img/community/meet_bg.jpg"
        color={theme.color}
        description={description}
        icon="/static/img/community/meet.svg"
        title={title}
      >
        <Items>
          <Item>
            <CommunityBlock
              title="Join the Dev Chat"
              action={
                <CommunityButton theme={theme} href="/">
                  Open Chat
                </CommunityButton>
              }
              icon="/static/img/community/discord.svg"
            >
              <Meta>
                Need urgent help? Ask advice from experienced developers online
              </Meta>
              <StatLine>
                <StatValue>1380+</StatValue>
                <StatLabel>registered developers</StatLabel>
              </StatLine>
              <StatLine>
                <StatValue>500+</StatValue>
                <StatLabel>messages posted over the past month</StatLabel>
              </StatLine>
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title="Ask a Question"
              action={
                topics.length && (
                  <CommunityButton theme={theme} href="/">
                    Read All Topics
                  </CommunityButton>
                )
              }
              icon="/static/img/community/discourse.svg"
            >
              {topics.length ? (
                topics.map(({ url, title, date, comments }) => (
                  <Line key={url}>
                    <Link
                      color={theme.color}
                      href={url}
                      target="_blank"
                      rel="norefferer nofollow"
                    >
                      {title}
                    </Link>
                    <Meta>
                      <Comments
                        href={url}
                        target="_blank"
                        rel="norefferer nofollow"
                      >
                        {pluralizeComments(comments)}
                      </Comments>
                      &nbsp; last activity{' '}
                      {formatDistanceToNow(new Date(date), 'MMMM, d')} ago
                    </Meta>
                  </Line>
                ))
              ) : (
                <Placeholder>Forum is unavailable right now</Placeholder>
              )}
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title="Post an Issue"
              action={
                issues.length && (
                  <CommunityButton theme={theme} href="/">
                    Read All Issues
                  </CommunityButton>
                )
              }
              icon="/static/img/community/github.svg"
            >
              {issues.length ? (
                issues.map(({ url, title, date, comments }) => (
                  <Line key={url}>
                    <Link
                      color={theme.color}
                      href={url}
                      target="_black"
                      rel="noreferrer nofollow"
                    >
                      {title}
                    </Link>
                    <Meta>
                      <Comments
                        href={url}
                        target="_black"
                        rel="noreferrer nofollow"
                      >
                        {pluralizeComments(comments)}
                      </Comments>
                      &nbsp;opened{' '}
                      {formatDistanceToNow(new Date(date), 'MMMM, d')} ago
                    </Meta>
                  </Line>
                ))
              ) : (
                <Placeholder>Github is unavailable right now</Placeholder>
              )}
            </CommunityBlock>
          </Item>
        </Items>
      </CommunitySection>
    </Wrapper>
  )
}

CommunityMeet.propTypes = {
  issues: PropTypes.array,
  theme: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string
  }),
  topics: PropTypes.array
}
