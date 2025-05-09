import { TogglesProvider } from '@dvcorg/gatsby-theme-iterative/src/components/Documentation/Markdown/ToggleProvider'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import { useCommentsCount } from '@dvcorg/gatsby-theme-iterative/src/utils/front/api'
import { pluralizeComments } from '@dvcorg/gatsby-theme-iterative/src/utils/front/i18n'
import patchHtmlAst from '@dvcorg/gatsby-theme-iterative/src/utils/front/patchHtmlAst'
import useCustomYtEmbeds from '@dvcorg/gatsby-theme-iterative/src/utils/front/useCustomYtEmbeds'
import tagToSlug from '@dvcorg/gatsby-theme-iterative/src/utils/shared/tagToSlug'
import cn from 'classnames'
import { useMemo, useRef } from 'react'
import { useWindowScroll, useWindowSize } from 'react-use'

import { Button } from '@/components/base/button'
import FeedMeta from '@/components/Blog/FeedMeta'
import Typography from '@/components/Typography'

import { IBlogPostData } from '@/templates/blog-post'

import HeroPic from './HeroPic'
import Markdown from './Markdown'
import Share from './Share'
import * as styles from './styles.module.css'

const Post = ({
  parent: { timeToRead, htmlAst },
  title,
  date,
  picture,
  pictureComment,
  description,
  descriptionLong,
  commentsUrl,
  tags,
  author,
  contributors,
  slug
}: IBlogPostData) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperRef, width, height, y])

  const { error, ready, result } = useCommentsCount(commentsUrl || ``)
  return (
    <TogglesProvider>
      <div className={styles.wrapper} ref={wrapperRef}>
        <Share
          className={cn(styles.share, isFixed && styles.fixed)}
          text={description}
          slug={slug}
        />
        <div className={styles.head}>
          <div className={styles.headContent}>
            <Typography variant="h2" as="h1">
              {title}
            </Typography>
            {descriptionLong ? (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: descriptionLong.html }}
              />
            ) : (
              <div className={styles.description}>{description}</div>
            )}
            <FeedMeta
              author={author}
              contributors={contributors || []}
              commentsCount={result}
              commentsUrl={commentsUrl}
              date={date}
              timeToRead={timeToRead}
            />
          </div>
        </div>
        <HeroPic picture={picture} pictureComment={pictureComment?.html} />

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
            <Button variant="outline" size="lg" asChild>
              <Link href={commentsUrl}>Discuss this post</Link>
            </Button>
            <Link href={commentsUrl} className={styles.count} target="_blank">
              {pluralizeComments(result || 0)}
            </Link>
          </div>
        )}
      </div>
    </TogglesProvider>
  )
}

export default Post
