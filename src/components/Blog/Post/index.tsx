import cn from 'classnames'

import React, { useMemo, useRef } from 'react'
import { useWindowScroll, useWindowSize } from 'react-use'

import { IBlogPostData } from '../../../templates/blog-post'

import { useCommentsCount } from '../../../utils/api'
import { pluralizeComments } from '../../../utils/i18n'
import tagToSlug from '../../../utils/tagToSlug'

import Markdown from './Markdown'
import FeedMeta from '../FeedMeta'
import Link from '../../Link'
import PseudoButton from '../../PseudoButton'
import HeroPic from './HeroPic'
import Share from './Share'
import PageContent from '../../PageContent'
import SubscribeSection from '../../SubscribeSection'

import styles from './styles.module.css'

const Post: React.SFC<IBlogPostData> = ({
  html,
  timeToRead,
  frontmatter,
  fields
}) => {
  const {
    title,
    date,
    picture,
    pictureComment,
    description,
    descriptionLong,
    commentsUrl,
    tags,
    author: {
      childMarkdownRemark: {
        frontmatter: { name, avatar }
      }
    }
  } = frontmatter

  const wrapperRef = useRef<HTMLDivElement>(null)
  const { width, height } = useWindowSize()
  const { y } = useWindowScroll()

  const isFixed = useMemo(() => {
    if (!wrapperRef.current) {
      return false
    }

    const { bottom } = wrapperRef.current.getBoundingClientRect()

    return bottom > height
  }, [wrapperRef, width, height, y])

  const { error, ready, result } = commentsUrl
    ? useCommentsCount(commentsUrl)
    : { error: null, ready: false, result: 0 }

  return (
    <>
      <PageContent>
        <div className={styles.wrapper} ref={wrapperRef}>
          <Share
            className={cn(styles.share, isFixed && styles.fixed)}
            text={description}
            slug={fields.slug}
          />
          <div className={styles.head}>
            <div className={styles.headContent}>
              <h1 className={styles.title}>{title}</h1>
              {descriptionLong ? (
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: descriptionLong }}
                />
              ) : (
                <div className={styles.description}>{description}</div>
              )}
              <FeedMeta
                commentsCount={result}
                commentsUrl={commentsUrl}
                name={name}
                avatar={avatar}
                date={date}
                timeToRead={timeToRead}
              />
            </div>
          </div>

          {picture && (
            <HeroPic picture={picture} pictureComment={pictureComment} />
          )}

          <div className={styles.content}>
            <Markdown html={html} />
          </div>
          {tags && (
            <div className={styles.tags}>
              {tags.map(tag => (
                <Link
                  href={`/tags/${tagToSlug(tag)}`}
                  className={styles.tag}
                  key={tag}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          {commentsUrl && ready && !error && (
            <div className={styles.comments}>
              <PseudoButton size="big" href={commentsUrl} target="_blank">
                Discuss this post
              </PseudoButton>
              <Link href={commentsUrl} className={styles.count} target="_blank">
                {pluralizeComments(result)}
              </Link>
            </div>
          )}
        </div>
      </PageContent>
      <SubscribeSection />
    </>
  )
}

export default Post
