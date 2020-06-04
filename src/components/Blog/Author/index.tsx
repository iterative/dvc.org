import React from 'react'

import cn from 'classnames'

import PageContent from '../../PageContent'
import { IBlogFeedPostList } from '../Feed'
import SubscribeSection from '../../SubscribeSection'
import Item from '../Feed/Item'
import feedStyles from '../Feed/styles.module.css'
import styles from './styles.module.css'
import { SocialIcons, ISocialIcon } from '../../SocialIcon'
import Image, { FixedObject } from 'gatsby-image'
import Paginator, { IPaginatorPageInfo } from '../../Paginator'

interface IAuthorHeaderProps {
  name: string
  links: Array<ISocialIcon>
  body: string
  avatar: {
    fixed: FixedObject
  }
}

interface IAuthorPageProps extends IAuthorHeaderProps, IPaginatorPageInfo {
  posts: IBlogFeedPostList
}

const AuthorHeader: React.FC<IAuthorHeaderProps> = ({
  name,
  body,
  avatar,
  links
}) => (
  <div className={cn(feedStyles.meta, styles.header)}>
    <Image fixed={avatar.fixed} className={styles.avatar} />
    <h2 className={feedStyles.header}>{name}</h2>
    <h3 className={styles.info}>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: body }}
      />
      <span className={styles.headerSocial}>
        <SocialIcons links={links} />
      </span>
    </h3>
  </div>
)

const AuthorPage: React.FC<IAuthorPageProps> = ({
  posts,
  name,
  links,
  body,
  avatar,
  nextPage,
  previousPage,
  currentPage
}) => {
  const firstPage = currentPage === 1
  return (
    <>
      <AuthorHeader name={name} links={links} body={body} avatar={avatar} />
      <PageContent>
        <div className={feedStyles.wrapper}>
          <div className={feedStyles.posts}>
            {posts.nodes.map((node, index) => (
              <Item
                feedPost={node}
                key={node.id}
                big={firstPage && index === 0}
              />
            ))}
          </div>
          <Paginator pageInfo={{ nextPage, previousPage, currentPage }} />
        </div>
      </PageContent>
      <SubscribeSection />
    </>
  )
}

export default AuthorPage
