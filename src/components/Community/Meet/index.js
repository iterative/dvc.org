import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import CommunityBlock from '../Block'
import CommunitySection from '../Section'

import { pluralizeComments } from '../../../utils/i18n'
import { logEvent } from '../../../utils/ga'
import { useIssues, useTopics } from '../../../utils/api'

import data from '../data'

const { description, mobileDescription, title } = data.section.meet

import { Stats, StatLabel, StatLine, StatValue } from './styles'

import {
  Button,
  Comments,
  HeaderLink,
  Item,
  Items,
  Line,
  Link,
  Meta,
  Placeholder,
  Wrapper
} from '../styles'

const logIssueAll = () => logEvent('community', 'issue', 'all')
const logTopicAll = () => logEvent('community', 'topic', 'all')
const logDiscord = () => logEvent('community', 'discord')

function CommunityTopic({ url, title, date, comments, color }) {
  const logTopic = useCallback(() => logEvent('community', 'forum', title), [
    title
  ])

  return (
    <Line>
      <Link
        color={color}
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        onClick={logTopic}
      >
        {title}
      </Link>
      <Meta>
        <Comments
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          onClick={logTopic}
        >
          {pluralizeComments(comments)}
        </Comments>{' '}
        • last activity {formatDistanceToNow(new Date(date), 'MMM, d') + ' '}
        ago
      </Meta>
    </Line>
  )
}

CommunityTopic.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  comments: PropTypes.number,
  color: PropTypes.string
}

function CommunityIssue({ url, title, date, comments, color }) {
  const logIssue = useCallback(() => logEvent('community', 'issue', title), [
    title
  ])

  return (
    <Line>
      <Link
        color={color}
        href={url}
        target="_black"
        rel="noreferrer noopener"
        onClick={logIssue}
      >
        {title}
      </Link>
      <Meta>
        <Comments
          href={url}
          target="_black"
          rel="noreferrer noopener"
          onClick={logIssue}
        >
          {pluralizeComments(comments)}
        </Comments>
        {' •'} opened {formatDistanceToNow(new Date(date), 'MMM, d')} ago
      </Meta>
    </Line>
  )
}

CommunityIssue.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  comments: PropTypes.number,
  color: PropTypes.string
}

export default function CommunityMeet({ theme }) {
  const { erorr: issuesError, ready: issuesReady, result: issues } = useIssues()
  const { erorr: topicsError, ready: topicsReady, result: topics } = useTopics()

  return (
    <Wrapper>
      <CommunitySection
        anchor="meet"
        background="/img/community/meet_bg.jpg"
        color={theme.color}
        contentVisible={true}
        description={description}
        icon="/img/community/meet.svg"
        mobileDescription={mobileDescription}
        title={title}
      >
        <Items>
          <Item>
            <CommunityBlock
              title={
                <HeaderLink
                  href="/chat"
                  target="_black"
                  rel="noreferrer noopener"
                  onClick={logDiscord}
                >
                  Join the Dev Chat
                </HeaderLink>
              }
              action={
                <Button
                  theme={theme}
                  href="/chat"
                  target="_black"
                  rel="noreferrer noopener"
                  onClick={logDiscord}
                >
                  Open Chat
                </Button>
              }
              icon="/img/community/discord.svg"
            >
              <Meta>
                Need urgent help? Ask advice from experienced developers online
              </Meta>
              <Stats>
                <StatLine>
                  <StatValue>{data.stats.users}</StatValue>
                  <StatLabel>registered developers</StatLabel>
                </StatLine>
                <StatLine>
                  <StatValue>{data.stats.messages}</StatValue>
                  <StatLabel>messages posted over the past month</StatLabel>
                </StatLine>
              </Stats>
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title={
                <HeaderLink
                  href="https://discuss.dvc.org"
                  target="_black"
                  rel="noreferrer noopener"
                  onClick={logTopicAll}
                >
                  Ask a Question
                </HeaderLink>
              }
              action={
                topics && (
                  <Button
                    theme={theme}
                    href="https://discuss.dvc.org"
                    target="_black"
                    rel="noreferrer noopener"
                    onClick={logTopicAll}
                  >
                    Read All Topics
                  </Button>
                )
              }
              icon="/img/community/discourse.svg"
            >
              {!topicsReady && <Placeholder>Loading...</Placeholder>}
              {topicsError && (
                <Placeholder>Forum unavailable right now</Placeholder>
              )}
              {topics &&
                topics.map(topic => (
                  <CommunityTopic
                    {...topic}
                    key={topic.url}
                    color={theme.color}
                  />
                ))}
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title={
                <HeaderLink
                  href="https://github.com/iterative/dvc/issues"
                  target="_black"
                  rel="noreferrer noopener"
                  onClick={logIssueAll}
                >
                  Post an Issue
                </HeaderLink>
              }
              action={
                issues && (
                  <Button
                    theme={theme}
                    href="https://github.com/iterative/dvc/issues"
                    target="_black"
                    rel="noreferrer noopener"
                    onClick={logIssueAll}
                  >
                    Read All Issues
                  </Button>
                )
              }
              icon="/img/community/github.svg"
            >
              {!issuesReady && <Placeholder>Loading...</Placeholder>}
              {issuesError && (
                <Placeholder>Github unavailable right now</Placeholder>
              )}
              {issues &&
                issues.map(issue => (
                  <CommunityIssue
                    {...issue}
                    key={issue.url}
                    color={theme.color}
                  />
                ))}
            </CommunityBlock>
          </Item>
        </Items>
      </CommunitySection>
    </Wrapper>
  )
}

CommunityMeet.propTypes = {
  theme: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string
  })
}
