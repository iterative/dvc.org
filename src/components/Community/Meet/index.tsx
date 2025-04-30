import LayoutWidthContainer from '@dvcorg/gatsby-theme-iterative/src/components/LayoutWidthContainer'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import {
  useIssues,
  useTopics,
  IGithubIssue,
  IDiscussTopic
} from '@dvcorg/gatsby-theme-iterative/src/utils/front/api'
import { pluralizeComments } from '@dvcorg/gatsby-theme-iterative/src/utils/front/i18n'
import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { useCallback } from 'react'

import { ICommunitySectionTheme } from '../'
import { useCommunityData } from '../../../utils/front/community'
import Block from '../Block'
import Section from '../Section'
import * as sharedStyles from '../styles.module.css'

import * as styles from './styles.module.css'

const log = (section: string, eventType: string): void =>
  logEvent('Community', { Section: 'Meet', [`Meet ${section}`]: eventType })
const logIssue = (eventType: string): void => log('Issue', eventType)
const logTopic = (eventType: string): void => log('Topic', eventType)
const logDiscordAll = (): void => log('Discord', 'all')

const Topic: React.FC<{ color: string } & IDiscussTopic> = ({
  url,
  title,
  date,
  comments,
  color
}) => {
  const logTopicTitle = useCallback(() => logTopic(title), [title])

  return (
    <div className={sharedStyles.line}>
      <Link
        className={sharedStyles.link}
        style={{ color }}
        href={url}
        target="_blank"
        onClick={logTopicTitle}
      >
        {title}
      </Link>
      <div className={sharedStyles.meta}>
        <Link
          className={sharedStyles.commentsLink}
          href={url}
          target="_blank"
          onClick={logTopicTitle}
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
  const logIssueTitle = useCallback(() => logIssue(title), [title])

  return (
    <div className={sharedStyles.line}>
      <Link
        className={sharedStyles.link}
        style={{ color }}
        href={url}
        target="_blank"
        onClick={logIssueTitle}
      >
        {title}
      </Link>
      <div
      // className={styles.meta}
      >
        <Link
          className={sharedStyles.commentsLink}
          href={url}
          target="_blank"
          onClick={logIssueTitle}
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
                  onClick={logDiscordAll}
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
                  onClick={logDiscordAll}
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
                  <div className={styles.statLabel}>community members</div>
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
                  onClick={() => logTopic('all')}
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
                    onClick={() => logTopic('all')}
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
                  onClick={() => logIssue('all')}
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
                    onClick={() => logIssue('all')}
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
