import React from 'react'

import cn from 'classnames'

import PageContent from '../../PageContent'
import { IBlogFeedPostList } from '../Feed'
import SubscribeSection from '../../SubscribeSection'
import Item from '../Feed/Item'
import styles from '../Feed/styles.module.css'

interface IAuthorPageProps {
  posts: IBlogFeedPostList
  bigFirst?: boolean
  header: React.ReactNode
  leadParagraph?: React.ReactNode
}

const AuthorPage: React.FC<IAuthorPageProps> = ({
  posts,
  bigFirst = true,
  header,
  leadParagraph
}) => {
  return (
    <>
      <PageContent>
        <div className={styles.wrapper}>
          <div
            className={cn(styles.meta, {
              [styles.metaSlim]: bigFirst
            })}
          >
            <h2 className={styles.header}>{header}</h2>
            {leadParagraph && (
              <div className={styles.lead}>{leadParagraph}</div>
            )}
          </div>
          <div className={styles.posts}>
            {posts.nodes.map((node, index) => (
              <Item
                feedPost={node}
                key={node.id}
                big={bigFirst && index === 0}
              />
            ))}
          </div>
        </div>
      </PageContent>
      <SubscribeSection />
    </>
  )
}

export default AuthorPage
