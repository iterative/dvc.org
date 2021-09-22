import React, { useEffect, useRef } from 'react'
import { useRafState, useWindowSize } from 'react-use'
import { graphql } from 'gatsby'
import Link from '../../../Link'
import Image, { FixedObject, FluidObject } from 'gatsby-image'
import cn from 'classnames'
import { ISocialIcon } from '../../../SocialIcon'

import FeedMeta from '../../FeedMeta'

import styles from './styles.module.css'

import { ReactComponent as Placeholder } from './placeholder.svg'

export interface IBlogPostData {
  id: string
  timeToRead: string
  slug: string
  title: string
  date: string
  description: string
  descriptionLong: string
  picture?: {
    big: FluidObject
    small: FluidObject
  }
  author: {
    name: string
    avatar: {
      fixed: FixedObject
    }
    links: Array<ISocialIcon>
  }
}

interface IBlogFeedItemProps {
  big?: boolean
  feedPost: IBlogPostData
}

const Item: React.FC<IBlogFeedItemProps> = ({
  big,
  feedPost: { title, description, date, picture, author, slug, timeToRead }
}) => {
  const { avatar, name, links } = author
  const bodyRef = useRef<HTMLDivElement>(null)
  const { width } = useWindowSize()
  const [isOverflown, setIsOverflown] = useRafState(true)

  useEffect(() => {
    if (bodyRef.current) {
      const { scrollHeight, clientHeight } = bodyRef.current

      setIsOverflown(scrollHeight <= clientHeight)
    }
  }, [width])

  const image = picture ? (big ? picture.big : picture.small) : undefined

  return (
    <div
      className={cn(
        styles.wrapper,
        big && styles.big,
        !picture && styles.placeholder
      )}
    >
      <Link href={slug} className={styles.pictureLink}>
        {picture ? (
          <Image fluid={image} className={styles.picture} />
        ) : (
          <Placeholder className={styles.picture} />
        )}
      </Link>
      <div
        className={cn(styles.body, !isOverflown && styles.overflown)}
        ref={bodyRef}
      >
        <Link href={slug} className={styles.title}>
          {title}
        </Link>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.meta}>
        <FeedMeta
          name={name}
          avatar={avatar}
          date={date}
          links={links}
          timeToRead={timeToRead}
        />
      </div>
    </div>
  )
}

export const query = graphql`
  fragment FeedPost on BlogPost {
    timeToRead
    id
    slug
    date(formatString: "MMM DD, YYYY")
    title
    description
    descriptionLong
    picture {
      big: fluid(
        maxWidth: 650
        maxHeight: 450
        cropFocus: CENTER
        quality: 90
      ) {
        ...GatsbyImageSharpFluid_withWebp
      }
      small: fluid(
        maxWidth: 300
        maxHeight: 250
        cropFocus: CENTER
        quality: 90
      ) {
        ...GatsbyImageSharpFluid_withWebp
      }
    }
    author {
      name
      links {
        url
        site
      }
      avatar {
        fixed(width: 40, height: 40, quality: 50, cropFocus: CENTER) {
          ...GatsbyImageSharpFixed_withWebp
        }
      }
    }
  }
`

export default Item
