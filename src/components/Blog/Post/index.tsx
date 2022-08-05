import cn from 'classnames'

import React, { useMemo, useRef } from 'react'
import { useWindowScroll, useWindowSize } from 'react-use'

import { IBlogPostData } from '../../../templates/blog-post'

import { useCommentsCount } from '@dvcorg/gatsby-theme-iterative/src/utils/front/api'
import { pluralizeComments } from '@dvcorg/gatsby-theme-iterative/src/utils/front/i18n'
import tagToSlug from '@dvcorg/gatsby-theme-iterative/src/utils/shared/tagToSlug'
import useCustomYtEmbeds from '@dvcorg/gatsby-theme-iterative/src/utils/front/useCustomYtEmbeds'

import Markdown from './Markdown'
import FeedMeta from '../FeedMeta'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import PseudoButton from '@dvcorg/gatsby-theme-iterative/src/components/PseudoButton'
import HeroPic from './HeroPic'
import Share from './Share'
import PageContent from '../../PageContent'
import SubscribeSection from '../../SubscribeSection'

import * as styles from './styles.module.css'
import patchHtmlAst from '@dvcorg/gatsby-theme-iterative/src/utils/front/patchHtmlAst'

const Post: React.FC<IBlogPostData> = ({
  htmlAst,
  timeToRead,
  title,
  date,
  picture,
  pictureComment,
  description,
  descriptionLong,
  commentsUrl,
  tags,
  author: { name, avatar, links },
  slug
}) => {
  const patchedHtmlAst = patchHtmlAst(htmlAst)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { width, height } = useWindowSize()
  const { y } = useWindowScroll()
  useCustomYtEmbeds()

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
            slug={slug}
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
                links={links}
              />
            </div>
          </div>
          <HeroPic picture={picture} pictureComment={pictureComment} />

          <div className={styles.content}>
            <Markdown htmlAst={patchedHtmlAst} />
          </div>
          {tags && (
            <div className={styles.tags}>
              {tags.map(tag => (
                <Link
                  href={`/blog/tags/${tagToSlug(tag)}`}
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
                {pluralizeComments(result || 0)}
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
