import React from 'react'
import PropTypes from 'prop-types'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import CommunityBlock from '../Block'
import CommunityButton from '../Button'
import CommunitySection from '../Section'

import data from '../data'

const { description, icon, title } = data.section.meet

import { Comments, Item, Items, Line, Link, Meta, Wrapper } from './styles'

export default function CommunityMeet({ discord, issues, theme, topics }) {
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
              title="Join the Dev Chat"
              action={
                <CommunityButton theme={theme} href="/">
                  Open Chat
                </CommunityButton>
              }
              icon="/static/img/community/discord.svg"
            >
              <div>{discord.registered} registered developers</div>
              <div>
                {discord.messages_per_month} messages posted over the past month
              </div>
              <div>{discord.online} users online</div>
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
                  <Link color={theme.color} href={url}>
                    {title}
                  </Link>
                  <Meta>
                    <Comments href={url}>{comments} comments</Comments>
                    &nbsp;opened {formatDistanceToNow(date, 'MMMM, d')} ago
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
