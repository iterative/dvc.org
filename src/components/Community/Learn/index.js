import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'

import LocalLink from '../../LocalLink'

import { logEvent } from '../../../utils/ga'

import CommunityBlock from '../Block'
import CommunitySection from '../Section'

import { usePosts, useCommentsCount } from '../../../utils/api'
import { pluralizeComments } from '../../../utils/i18n'

import {
  Button,
  Comments,
  HeaderLink,
  ImageLine,
  Item,
  Items,
  Line,
  Link,
  Meta,
  NbspWrapper,
  Placeholder,
  TextWrapper,
  Wrapper
} from '../styles'

import { Image } from './styles'

import data from '../data'

const { description, mobileDescription, title } = data.section.learn
const { documentation, userContent } = data

const logPostAll = () => logEvent('community', 'blog', 'all')
const logDocumentationAll = () => logEvent('community', 'documentation', 'all')

function CommunityBlogPost({
  url,
  title,
  date,
  color,
  commentsUrl,
  pictureUrl
}) {
  const logPost = useCallback(() => logEvent('community', 'blog', title), [
    title
  ])
  const { error, ready, result } = useCommentsCount(commentsUrl)

  return (
    <ImageLine key={url}>
      {pictureUrl && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          onClick={logPost}
        >
          <Image src={pictureUrl} alt="" />
        </a>
      )}
      <TextWrapper>
        <Link
          color={color}
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          onClick={logPost}
        >
          {title}
        </Link>
        <Meta>
          {ready && !error && (
            <>
              <Comments
                href={commentsUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                {pluralizeComments(result)}
              </Comments>
              {' • '}
            </>
          )}
          <NbspWrapper>{format(new Date(date), 'MMM, d')}</NbspWrapper>
        </Meta>
      </TextWrapper>
    </ImageLine>
  )
}

CommunityBlogPost.propTypes = {
  color: PropTypes.string,
  commentsUrl: PropTypes.string,
  pictureUrl: PropTypes.string,
  date: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string
}

function CommunityUserContent({ url, title, author, date, color, pictureUrl }) {
  const logUserContent = useCallback(
    () => logEvent('community', 'user-content', title),
    [title]
  )

  return (
    <ImageLine key={url}>
      {pictureUrl && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          onClick={logUserContent}
        >
          <Image src={pictureUrl} alt="" />
        </a>
      )}
      <TextWrapper>
        <Link
          color={color}
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          onClick={logUserContent}
        >
          {title}
        </Link>
        <Meta>
          {author} •{' '}
          <NbspWrapper>{format(new Date(date), 'MMM, d')}</NbspWrapper>
        </Meta>
      </TextWrapper>
    </ImageLine>
  )
}

CommunityUserContent.propTypes = {
  author: PropTypes.string,
  color: PropTypes.string,
  date: PropTypes.string,
  pictureUrl: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string
}

function CommunityDocumentation({ url, title, description, color }) {
  const logDocumentation = useCallback(
    () => logEvent('community', 'documentation', title),
    [title]
  )

  return (
    <Line key={url}>
      <LocalLink
        href={url}
        as={Link}
        color={color}
        large="true"
        onClick={logDocumentation}
      >
        {title}
      </LocalLink>
      <Meta>{description}</Meta>
    </Line>
  )
}

CommunityDocumentation.propTypes = {
  color: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string
}

export default function CommunityLearn({ theme }) {
  const { error, ready, result: posts } = usePosts()

  return (
    <Wrapper>
      <CommunitySection
        anchor="learn"
        background="/static/img/community/learn_bg.jpg"
        color={theme.color}
        description={description}
        icon="/static/img/community/learn.svg"
        mobileDescription={mobileDescription}
        title={title}
      >
        <Items>
          <Item>
            <CommunityBlock
              title={
                <LocalLink
                  href="/doc"
                  as={HeaderLink}
                  onClick={logDocumentationAll}
                >
                  Documentation
                </LocalLink>
              }
              action={
                <LocalLink
                  href="/doc"
                  as={Button}
                  theme={theme}
                  onClick={logDocumentationAll}
                >
                  See all docs
                </LocalLink>
              }
            >
              {documentation.map(documentation => (
                <CommunityDocumentation
                  {...documentation}
                  key={documentation.url}
                  color={theme.color}
                />
              ))}
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock
              title={
                <HeaderLink
                  href="https://blog.dvc.org"
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={logPostAll}
                >
                  DVC Blog
                </HeaderLink>
              }
              action={
                posts && (
                  <Button
                    theme={theme}
                    href="https://blog.dvc.org"
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={logPostAll}
                  >
                    See all Posts
                  </Button>
                )
              }
            >
              {!ready && <Placeholder>Loading...</Placeholder>}
              {error && <Placeholder>Blog unavailable right now</Placeholder>}
              {posts &&
                posts.map(post => (
                  <CommunityBlogPost
                    {...post}
                    key={post.url}
                    color={theme.color}
                  />
                ))}
            </CommunityBlock>
          </Item>
          <Item>
            <CommunityBlock title="User Content">
              {userContent.map(userContent => (
                <CommunityUserContent
                  {...userContent}
                  key={userContent.url}
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

CommunityLearn.propTypes = {
  theme: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string
  })
}
