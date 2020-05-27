import React from 'react'

import cn from 'classnames'

import PageContent from '../../PageContent'
import { IBlogFeedPostList } from '../Feed'
import SubscribeSection from '../../SubscribeSection'
import Item from '../Feed/Item'
import feedStyles from '../Feed/styles.module.css'
import styles from './styles.module.css'
import Link from '../../Link'
import Image, { FixedObject } from 'gatsby-image'

interface IAuthorHeaderProps {
  name: string
  link: string
  body: string
  avatar: {
    fixed: FixedObject
  }
}

interface IAuthorPageProps extends IAuthorHeaderProps {
  posts: IBlogFeedPostList
  bigFirst?: boolean
  body: string
}

const AuthorHeader: React.FC<IAuthorHeaderProps> = ({
  name,
  link,
  body,
  avatar
}) => (
  <div className={cn(feedStyles.meta, styles.header)}>
    <Image fixed={avatar.fixed} className={styles.avatar} />
    <div>
      <h2 className={feedStyles.header}>{name}</h2>
      <div dangerouslySetInnerHTML={{ __html: body }} />
      {link && (
        <div className={styles.links}>
          <h3>
            <Link href={link}>{link}</Link>
          </h3>
        </div>
      )}
    </div>
  </div>
)

const AuthorPage: React.FC<IAuthorPageProps> = ({
  posts,
  bigFirst = true,
  name,
  link,
  body,
  avatar
}) => {
  return (
    <>
      <AuthorHeader name={name} link={link} body={body} avatar={avatar} />
      <PageContent>
        <div className={feedStyles.wrapper}>
          <div className={feedStyles.posts}>
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
