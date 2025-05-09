import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import SocialIcon from '@dvcorg/gatsby-theme-iterative/src/components/SocialIcon'
import { pluralizeComments } from '@dvcorg/gatsby-theme-iterative/src/utils/front/i18n'
import { GatsbyImage } from 'gatsby-plugin-image'

import { IAuthor } from '@/templates/blog-post'

import * as styles from './styles.module.css'

interface IBlogFeedMetaProps {
  commentsUrl?: string
  commentsCount?: number
  date: string
  timeToRead: string
  author: IAuthor
  contributors?: IAuthor[]
}

const FeedMeta: React.FC<IBlogFeedMetaProps> = ({
  author: { avatar, links, name },
  contributors,
  commentsUrl,
  commentsCount,
  date,
  timeToRead
}) => {
  return (
    <div className={styles.wrapper}>
      {avatar && (
        <GatsbyImage
          alt=""
          image={avatar.childImageSharp.gatsbyImageData}
          className={styles.avatar}
        />
      )}
      <ul className={styles.list}>
        <li className={styles.segment}>
          <div>{name}</div>
          {contributors && contributors.length > 0 ? (
            <div className="item-center flex flex-row">
              <span className="text-sm">+{contributors.length}</span>
              {contributors.map(
                ({ avatar, name }) =>
                  avatar && (
                    <GatsbyImage
                      key={name}
                      alt={name}
                      title={name}
                      image={avatar.childImageSharp.gatsbyImageData}
                      className="ml-1 inline-block rounded-full"
                    />
                  )
              )}
            </div>
          ) : null}
        </li>
        {links && (
          <li className={styles.linkIcons}>
            {links.map(({ site, url }, i) => (
              <SocialIcon site={site} url={url} key={i} />
            ))}
          </li>
        )}

        <li className={styles.item}>
          {date} • {timeToRead} min read
        </li>
        {commentsUrl && typeof commentsCount === `number` && (
          <li className={styles.item}>
            <Link
              href={commentsUrl}
              className={styles.commentLink}
              target="_blank"
            >
              {pluralizeComments(commentsCount)}
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default FeedMeta
