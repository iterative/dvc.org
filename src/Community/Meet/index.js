import React from 'react'
import PropTypes from 'prop-types'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import CommunityBlock from '../Block'
import CommunityButton from '../Button'
import CommunitySection from '../Section'

import { pluralizeComments } from '../../utils/i18n'

import data from '../data'

const { description, title } = data.section.meet

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
        background="/static/img/community/meet_bg.jpg"
        color={theme.color}
        description={description}
        icon="/static/img/community/meet.svg"
        title={title}
      >
        <Items>
          <Item>
            <iframe
              title="chat"
              src="https://discordapp.com/widget?id=485586884165107732&theme=light&header=Text"
              width="100%"
              height="100%"
              allowTransparency="true"
              frameBorder="0"
            ></iframe>
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
              large={true}
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
              large={true}
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
