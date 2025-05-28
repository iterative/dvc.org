import cn from 'classnames'
import { format } from 'date-fns/format'
import { useCallback } from 'react'

import LayoutWidthContainer from '@dvcorg/gatsby-theme-iterative/src/components/LayoutWidthContainer'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import { useCommentsCount } from '@dvcorg/gatsby-theme-iterative/src/utils/front/api'
import { pluralizeComments } from '@dvcorg/gatsby-theme-iterative/src/utils/front/i18n'
import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'
import { getFirstPage } from '@dvcorg/gatsby-theme-iterative/src/utils/shared/sidebar'

import { ICommunitySectionTheme } from '../'
import usePosts from '../../../queries/usePosts'
import { useCommunityData } from '../../../utils/front/community'
import Block from '../Block'
import Section from '../Section'
import * as sharedStyles from '../styles.module.css'

import * as styles from './styles.module.css'

const docsPage = getFirstPage()

const log = (section: string, value: string) =>
  logEvent('Community', { Section: 'learn', [`Learn ${section}`]: value })
const logBlog = (eventType: string) => log('Blog', eventType)
const logDoc = (eventType: string): void => log('Doc', eventType)
const logUserContent = (eventType: string): void =>
  log('User Content', eventType)

interface ICommunityBlogPost {
  color: string
  commentsUrl?: string
  pictureUrl?: string
  date: string
  title: string
  url: string
}

const BlogPost: React.FC<ICommunityBlogPost> = ({
  url,
  title,
  date,
  color,
  commentsUrl,
  pictureUrl
}) => {
  const logPost = useCallback(() => logBlog(title), [title])

  const { error, ready, result } = useCommentsCount(commentsUrl || '')

  return (
    <div className={cn(sharedStyles.line, sharedStyles.image)} key={url}>
      {pictureUrl && (
        <Link
          href={url}
          target="_blank"
          onClick={logPost}
          className={sharedStyles.link}
        >
          <img className={styles.image} src={pictureUrl} alt="" />
        </Link>
      )}
      <div>
        <Link
          className={sharedStyles.link}
          style={{ color }}
          href={url}
          target="_blank"
          onClick={logPost}
        >
          {title}
        </Link>
        <div className={sharedStyles.meta}>
          {commentsUrl && ready && !error && (
            <>
              <Link
                className={sharedStyles.commentsLink}
                href={commentsUrl}
                target="_blank"
              >
                {pluralizeComments(result || 0)}
              </Link>
              {' • '}
            </>
          )}
          <span className={sharedStyles.nbsp}>
            {format(new Date(date), 'MMM, d')}
          </span>
        </div>
      </div>
    </div>
  )
}

export interface ICommunityUserContentProps {
  author: string
  color: string
  date: string
  pictureUrl: string
  title: string
  url: string
}

const UserContent: React.FC<ICommunityUserContentProps> = ({
  url,
  title,
  author,
  date,
  color,
  pictureUrl
}) => {
  const logContent = useCallback(() => logUserContent(title), [title])

  return (
    <div className={cn(sharedStyles.line, sharedStyles.image)} key={url}>
      {pictureUrl && (
        <Link
          className={sharedStyles.link}
          href={url}
          target="_blank"
          onClick={logContent}
        >
          <img className={styles.image} src={pictureUrl} alt="" />
        </Link>
      )}
      <div>
        <Link
          className={sharedStyles.link}
          style={{ color }}
          href={url}
          target="_blank"
          onClick={logContent}
        >
          {title}
        </Link>
        <div className={sharedStyles.meta}>
          {author} •{' '}
          <span className={sharedStyles.nbsp}>
            {format(new Date(date), 'MMM, d')}
          </span>
        </div>
      </div>
    </div>
  )
}

export interface ICommunityDocumentationProps {
  color: string
  description: string
  title: string
  url: string
}

const Documentation: React.FC<ICommunityDocumentationProps> = ({
  url,
  title,
  description,
  color
}) => {
  const logDocumentation = useCallback(() => logDoc(title), [title])

  return (
    <div className={sharedStyles.line} key={url}>
      <Link
        className={cn(sharedStyles.link, sharedStyles.large)}
        style={{ color }}
        href={url}
        onClick={logDocumentation}
      >
        {title}
      </Link>
      <div className={sharedStyles.meta}>{description}</div>
    </div>
  )
}

const Learn: React.FC<{ theme: ICommunitySectionTheme }> = ({ theme }) => {
  const posts = usePosts()
  const {
    rest: {
      documentation,
      userContent,
      section: {
        learn: { description, mobileDescription, title }
      }
    }
  } = useCommunityData()

  return (
    <LayoutWidthContainer className={sharedStyles.wrapper}>
      <Section
        anchor="learn"
        background="/img/community/learn_bg.jpg"
        color={theme.color}
        description={description}
        icon="/img/community/learn.svg"
        mobileDescription={mobileDescription}
        title={title}
      >
        <div className={sharedStyles.items}>
          <div className={sharedStyles.item}>
            <Block
              title={
                <Link
                  className={sharedStyles.headerLink}
                  href={docsPage}
                  onClick={() => logDoc('all')}
                >
                  Documentation
                </Link>
              }
              action={
                <Link
                  className={sharedStyles.button}
                  style={theme}
                  href={docsPage}
                  onClick={() => logDoc('all')}
                >
                  See all docs
                </Link>
              }
            >
              {documentation.map(documentation => (
                <Documentation
                  {...documentation}
                  key={documentation.url}
                  color={theme.color}
                />
              ))}
            </Block>
          </div>
          <div className={sharedStyles.item}>
            <Block
              title={
                <Link
                  className={sharedStyles.headerLink}
                  href="https://dvc.org/blog"
                  onClick={() => logBlog('all')}
                >
                  DVC Blog
                </Link>
              }
              action={
                posts && (
                  <Link
                    className={sharedStyles.button}
                    style={theme}
                    href="https://dvc.org/blog"
                    onClick={() => logBlog('all')}
                  >
                    See all Posts
                  </Link>
                )
              }
            >
              {posts.map(post => (
                <BlogPost {...post} key={post.url} color={theme.color} />
              ))}
            </Block>
          </div>
          <div className={sharedStyles.item}>
            <Block title="User Content">
              {userContent.map(userContent => (
                <UserContent
                  {...userContent}
                  key={userContent.url}
                  color={theme.color}
                />
              ))}
            </Block>
          </div>
        </div>
      </Section>
    </LayoutWidthContainer>
  )
}

export default Learn
