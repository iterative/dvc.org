import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import tagToSlug from '@dvcorg/gatsby-theme-iterative/src/utils/shared/tagToSlug'
import cn from 'classnames'
import { graphql } from 'gatsby'
import { ArrowRightIcon } from 'lucide-react'

import Paginator, { IPaginatorPageInfo } from '@/components/Blog/Paginator'

import Item, { IBlogPostData } from './Item'
import * as styles from './styles.module.css'

export interface IBlogFeedPostList {
  totalCount?: number
  nodes: Array<IBlogPostData>
}

interface IBlogFeedProps {
  feedPostList: IBlogFeedPostList
  bigFirst?: boolean
  header?: string
  leadParagraph?: React.ReactNode
  pageInfo: IPaginatorPageInfo
  tag?: string
}

const Feed: React.FC<IBlogFeedProps> = ({
  feedPostList: { nodes },
  pageInfo,
  bigFirst = true,
  header,
  leadParagraph,
  tag
}) => {
  return (
    <>
      <div
        className={cn(styles.meta, {
          [styles.metaSlim]: bigFirst
        })}
      >
        {tag && header ? (
          <div className={styles.headerRow}>
            <h2 className={styles.header} id={tagToSlug(header)}>
              {` `}
              {header}
              {` `}
            </h2>
            <Link
              href={`/blog/tags/${tagToSlug(tag)}`}
              className={cn(styles.viewAll, `group`)}
            >
              View all posts
              <ArrowRightIcon className="transition-all group-hover:scale-150" />
            </Link>
          </div>
        ) : (
          header && (
            <h2 className={styles.header} id={tagToSlug(header)}>
              {` `}
              {header}
              {` `}
            </h2>
          )
        )}
        {leadParagraph && <div className={styles.lead}>{leadParagraph}</div>}
      </div>
      <div className={styles.posts}>
        {nodes.map((node, index) => (
          <Item
            feedPost={node}
            key={node.id}
            big={bigFirst && index === 0 && pageInfo.currentPage === 1}
          />
        ))}
      </div>
      <Paginator pageInfo={pageInfo} />
    </>
  )
}

export const query = graphql`
  fragment FeedPostList on BlogPostConnection {
    nodes {
      ...FeedPost
    }
  }
`

export default Feed
