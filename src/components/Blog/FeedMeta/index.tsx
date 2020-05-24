import Image, { FixedObject } from 'gatsby-image'
import React from 'react'

import Link from '../../Link'
import { pluralizeComments } from '../../../utils/front/i18n'

import styles from './styles.module.css'

interface IBlogFeedMetaProps {
  avatar: {
    fixed: FixedObject
  }
  commentsUrl?: string
  commentsCount?: number
  date: string
  name: string
  timeToRead: string
  link?: string
}

const FeedMeta: React.FC<IBlogFeedMetaProps> = ({
  avatar,
  commentsUrl,
  commentsCount,
  date,
  name,
  timeToRead,
  link
}) => {
  return (
    <div className={styles.wrapper}>
      <Image fixed={avatar.fixed} className={styles.avatar} />
      <ul className={styles.list}>
        <li className={styles.item}>
          {link ? (
            <Link href={link} className={styles.link}>
              {name}
            </Link>
          ) : (
            name
          )}
        </li>
        <li className={styles.item}>
          {date} • {timeToRead} min read
        </li>
        {commentsUrl && typeof commentsCount === 'number' && (
          <li className={styles.item}>
            <Link href={commentsUrl} className={styles.link} target="_blank">
              {pluralizeComments(commentsCount)}
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default FeedMeta
