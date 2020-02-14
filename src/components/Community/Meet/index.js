import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import CommunityBlock from '../Block'
import CommunityButton from '../Button'
import CommunitySection from '../Section'

import { pluralizeComments } from '../../../utils/i18n'
import { logEvent } from '../../../utils/ga'
import { getLatestIssues, getLatestTopics } from '../../../utils/api'

import data from '../data'

const { description, mobileDescription, title } = data.section.meet

import { Stats, StatLabel, StatLine, StatValue } from './styles'

import {
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
  const [isIssuesLoaded, setIsIssuesLoaded] = useState(false)
  const [issues, setIssues] = useState([])

  const [isTopicsLoaded, setIsTopicsLoaded] = useState(false)
  const [topics, setTopics] = useState([])

  useEffect(() => {
    getLatestIssues().then(result => {
      setIssues(result)
      setIsIssuesLoaded(true)
    })
    getLatestTopics().then(result => {
      setTopics(result)
      setIsTopicsLoaded(true)
    })
  }, [])

  return (
    <Wrapper>
      <CommunitySection
        anchor="meet"
        background="/static/img/community/meet_bg.jpg"
        color={theme.color}
        contentVisible={true}
        description={description}
        icon="/static/img/community/meet.svg"
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
                <CommunityButton
                  theme={theme}
                  href="/chat"
                  target="_black"
                  rel="noreferrer noopener"
                  onClick={logDiscord}
                >
                  Open Chat
                </CommunityButton>
              }
              icon="/static/img/community/discord.svg"
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
                topics.length && (
                  <CommunityButton
                    theme={theme}
                    href="https://discuss.dvc.org"
                    target="_black"
                    rel="noreferrer noopener"
                    onClick={logTopicAll}
                  >
                    Read All Topics
                  </CommunityButton>
                )
              }
              icon="/static/img/community/discourse.svg"
            >
              {!isTopicsLoaded && <Placeholder>Loading...</Placeholder>}
              {isTopicsLoaded &&
                !!topics.length &&
                topics.map(topic => (
                  <CommunityTopic
                    {...topic}
                    key={topic.url}
                    color={theme.color}
                  />
                ))}
              {isTopicsLoaded && !topics.length && (
                <Placeholder>Forum is unavailable right now</Placeholder>
              )}
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
                issues.length && (
                  <CommunityButton
                    theme={theme}
                    href="https://github.com/iterative/dvc/issues"
                    target="_black"
                    rel="noreferrer noopener"
                    onClick={logIssueAll}
                  >
                    Read All Issues
                  </CommunityButton>
                )
              }
              icon="/static/img/community/github.svg"
            >
              {!isIssuesLoaded && <Placeholder>Loading...</Placeholder>}
              {isIssuesLoaded &&
                !!issues.length &&
                issues.map(issue => (
                  <CommunityIssue
                    {...issue}
                    key={issue.url}
                    color={theme.color}
                  />
                ))}
              {isIssuesLoaded && !issues.lengts && (
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
