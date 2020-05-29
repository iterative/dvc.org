import Image, { FixedObject } from 'gatsby-image'
import React from 'react'

import Link from '../../Link'
import { pluralizeComments } from '../../../utils/front/i18n'

import styles from './styles.module.css'
import { SocialIcons, ISocialIcon } from '../../SocialIcon'

interface IBlogFeedMetaProps {
  avatar: {
    fixed: FixedObject
  }
  commentsUrl?: string
  commentsCount?: number
  slug?: string
  date: string
  name: string
  timeToRead: string
  links: Array<ISocialIcon>
}

const FeedMeta: React.FC<IBlogFeedMetaProps> = ({
  avatar,
  commentsUrl,
  commentsCount,
  date,
  name,
  timeToRead,
  links,
  slug
}) => {
  return (
    <div className={styles.wrapper}>
      <Image fixed={avatar.fixed} className={styles.avatar} />
      <ul className={styles.list}>
        <li className={styles.segment}>
          {slug ? (
            <Link href={slug} className={styles.link}>
              {name}
            </Link>
          ) : (
            name
          )}
        </li>
        {links && (
          <li className={styles.linkIcons}>
            <SocialIcons links={links} />
          </li>
        )}

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
