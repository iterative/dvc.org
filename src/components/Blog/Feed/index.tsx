import { graphql } from 'gatsby'

import React from 'react'

import cn from 'classnames'

import Paginator, { IPaginatorPageInfo } from '../../Paginator'
import Item, { IBlogPostData } from './Item'

import styles from './styles.module.css'

export interface IBlogFeedPostList {
  nodes: Array<IBlogPostData>
}

interface IBlogFeedProps {
  feedPostList: IBlogFeedPostList
  bigFirst?: boolean
  header: React.ReactNode
  leadParagraph?: React.ReactNode
  pageInfo: IPaginatorPageInfo
}

const Feed: React.FC<IBlogFeedProps> = ({
  feedPostList: { nodes },
  pageInfo,
  bigFirst = true,
  header,
  leadParagraph
}) => {
  return (
    <div className={styles.wrapper}>
      <div
        className={cn(styles.meta, {
          [styles.metaSlim]: bigFirst
        })}
      >
        <h2 className={styles.header}>{header}</h2>
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
    </div>
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
