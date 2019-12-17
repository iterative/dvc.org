import React from 'react'
import PropTypes from 'prop-types'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import CommunityBlock from '../Block'
import CommunityButton from '../Button'
import CommunitySection from '../Section'

import { formatNumber } from '../../utils/format'

import data from '../data'

const { description, title } = data.section.meet

import {
  Comments,
  Item,
  Items,
  Line,
  Link,
  Meta,
  StatLabel,
  StatLine,
  StatValue,
  Wrapper
} from './styles'

export default function CommunityMeet({ discord, issues, theme, topics }) {
  return (
    <Wrapper>
      <CommunitySection
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
              <StatLine>
                <StatValue>{formatNumber(discord.registered)}</StatValue>
                <StatLabel>registered developers</StatLabel>
              </StatLine>
              <StatLine>
                <StatValue>
                  {formatNumber(discord.messages_per_month)}
                </StatValue>
                <StatLabel>messages posted over the past month</StatLabel>
              </StatLine>
              <StatLine>
                <StatValue>{formatNumber(discord.online)}</StatValue>
                <StatLabel>
                  users
                  <br />
                  online
                </StatLabel>
              </StatLine>
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title="Ask a Question"
              action={
                <CommunityButton theme={theme} href="/">
                  Read All Topics
                </CommunityButton>
              }
              icon="/static/img/community/discourse.svg"
            >
              {topics.map(({ url, title, date, comments }) => (
                <Line key={url}>
                  <Link color={theme.color} href={url}>
                    {title}
                  </Link>
                  <Meta>
                    <Comments href={url}>{comments} comments</Comments>
                    &nbsp; last activity {formatDistanceToNow(
                      date,
                      'MMMM, d'
                    )}{' '}
                    ago
                  </Meta>
                </Line>
              ))}
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title="Post an Issue"
              action={
                <CommunityButton theme={theme} href="/">
                  Read All Issues
                </CommunityButton>
              }
              icon="/static/img/community/github.svg"
            >
              {issues.map(({ url, title, date, comments }) => (
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
                      {comments} comments
                    </Comments>
                    &nbsp;opened{' '}
                    {formatDistanceToNow(new Date(date), 'MMMM, d')} ago
                  </Meta>
                </Line>
              ))}
            </CommunityBlock>
          </Item>
        </Items>
      </CommunitySection>
    </Wrapper>
  )
}

CommunityMeet.propTypes = {
  discord: PropTypes.object,
  issues: PropTypes.array,
  theme: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string
  }),
  topics: PropTypes.array
}
