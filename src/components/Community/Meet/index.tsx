import React, { useCallback } from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import { ICommunitySectionTheme } from '../'
import LayoutWidthContainer from '../../LayoutWidthContainer'
import Block from '../Block'
import Section from '../Section'
import Link from '../../Link'
import { pluralizeComments } from '../../../utils/front/i18n'
import { logEvent } from '../../../utils/front/ga'
import {
  useIssues,
  useTopics,
  IGithubIssue,
  IDiscussTopic
} from '../../../utils/front/api'

import { useCommunityData } from '../../../utils/front/community'
import sharedStyles from '../styles.module.css'
import styles from './styles.module.css'

const logIssueAll = (): void => logEvent('community', 'issue', 'all')
const logTopicAll = (): void => logEvent('community', 'topic', 'all')
const logDiscord = (): void => logEvent('community', 'discord')

const Topic: React.FC<{ color: string } & IDiscussTopic> = ({
  url,
  title,
  date,
  comments,
  color
}) => {
  const logTopic = useCallback(() => logEvent('community', 'forum', title), [
    title
  ])

  return (
    <div className={sharedStyles.line}>
      <Link
        className={sharedStyles.link}
        style={{ color }}
        href={url}
        target="_blank"
        onClick={logTopic}
      >
        {title}
      </Link>
      <div className={sharedStyles.meta}>
        <Link
          className={sharedStyles.commentsLink}
          href={url}
          target="_blank"
          onClick={logTopic}
        >
          {pluralizeComments(comments)}
        </Link>
        {` • last activity ${formatDistanceToNow(new Date(date))} ago`}
      </div>
    </div>
  )
}

const Issue: React.FC<{ color: string } & IGithubIssue> = ({
  url,
  title,
  date,
  comments,
  color
}) => {
  const logIssue = useCallback(() => logEvent('community', 'issue', title), [
    title
  ])

  return (
    <div className={sharedStyles.line}>
      <Link
        className={sharedStyles.link}
        style={{ color }}
        href={url}
        target="_blank"
        onClick={logIssue}
      >
        {title}
      </Link>
      <div className={styles.meta}>
        <Link
          className={sharedStyles.commentsLink}
          href={url}
          target="_blank"
          onClick={logIssue}
        >
          {pluralizeComments(comments)}
        </Link>
        {` • opened ${formatDistanceToNow(new Date(date))} ago`}
      </div>
    </div>
  )
}

const Meet: React.FC<{ theme: ICommunitySectionTheme }> = ({ theme }) => {
  const data = useCommunityData().rest
  const { description, mobileDescription, title } = data.section.meet
  const { error: issuesError, ready: issuesReady, result: issues } = useIssues()
  const { error: topicsError, ready: topicsReady, result: topics } = useTopics()

  return (
    <LayoutWidthContainer className={sharedStyles.wrapper}>
      <Section
        anchor="meet"
        background="/img/community/meet_bg.jpg"
        color={theme.color}
        contentVisible={true}
        description={description}
        icon="/img/community/meet.svg"
        mobileDescription={mobileDescription}
        title={title}
      >
        <div className={sharedStyles.items}>
          <div className={sharedStyles.item}>
            <Block
              title={
                <Link
                  className={sharedStyles.headerLink}
                  href="/chat"
                  target="_blank"
                  onClick={logDiscord}
                >
                  Join the Dev Chat
                </Link>
              }
              action={
                <Link
                  className={sharedStyles.button}
                  style={theme}
                  href="/chat"
                  target="_blank"
                  onClick={logDiscord}
                >
                  Open Chat
                </Link>
              }
              icon="/img/community/discord.svg"
            >
              <div className={sharedStyles.meta}>
                Need urgent help? Ask advice from experienced developers online
              </div>
              <div className={styles.stats}>
                <div className={styles.statLine}>
                  <div className={styles.statValue}>{data.stats.users}</div>
                  <div className={styles.statLabel}>registered developers</div>
                </div>
                <div className={styles.statLine}>
                  <div className={styles.statValue}>{data.stats.messages}</div>
                  <div className={styles.statLabel}>
                    messages posted over the past month
                  </div>
                </div>
              </div>
            </Block>
          </div>
          <div className={sharedStyles.item}>
            <Block
              title={
                <Link
                  className={sharedStyles.headerLink}
                  href="https://discuss.dvc.org"
                  target="_blank"
                  onClick={logTopicAll}
                >
                  Ask a Question
                </Link>
              }
              action={
                topics && (
                  <Link
                    className={sharedStyles.button}
                    style={theme}
                    href="https://discuss.dvc.org"
                    target="_blank"
                    onClick={logTopicAll}
                  >
                    Read All Topics
                  </Link>
                )
              }
              icon="/img/community/discourse.svg"
            >
              {!topicsReady && (
                <div className={sharedStyles.placeholder}>Loading...</div>
              )}
              {topicsError && (
                <div className={sharedStyles.placeholder}>
                  Forum unavailable right now
                </div>
              )}
              {topics &&
                topics.map(topic => (
                  <Topic {...topic} key={topic.url} color={theme.color} />
                ))}
            </Block>
          </div>
          <div className={sharedStyles.item}>
            <Block
              title={
                <Link
                  className={sharedStyles.headerLink}
                  href="https://github.com/iterative/dvc/issues"
                  target="_blank"
                  onClick={logIssueAll}
                >
                  Post an Issue
                </Link>
              }
              action={
                issues && (
                  <Link
                    className={sharedStyles.button}
                    style={theme}
                    href="https://github.com/iterative/dvc/issues"
                    target="_blank"
                    onClick={logIssueAll}
                  >
                    Read All Issues
                  </Link>
                )
              }
              icon="/img/community/github.svg"
            >
              {!issuesReady && (
                <div className={sharedStyles.placeholder}>Loading...</div>
              )}
              {issuesError && (
                <div className={sharedStyles.placeholder}>
                  Github unavailable right now
                </div>
              )}
              {issues &&
                issues.map(issue => (
                  <Issue {...issue} key={issue.url} color={theme.color} />
                ))}
            </Block>
          </div>
        </div>
      </Section>
    </LayoutWidthContainer>
  )
}

export default Meet
