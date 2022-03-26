import React, { useEffect, useRef } from 'react'
import { useRafState, useWindowSize } from 'react-use'
import { graphql } from 'gatsby'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import cn from 'classnames'
import { ISocialIcon } from '@dvcorg/gatsby-theme-iterative/src/components/SocialIcon'

import FeedMeta from '../../FeedMeta'

import * as styles from './styles.module.css'

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
    childImageSharp: {
      big: IGatsbyImageData
    }
  }
  author: {
    name: string
    avatar: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
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

  const image = picture?.childImageSharp.big

  return (
    <div
      className={cn(
        styles.wrapper,
        big && styles.big,
        !picture && styles.placeholder
      )}
    >
      <Link href={slug} className={styles.pictureLink}>
        {image ? (
          <GatsbyImage alt="" image={image} className={styles.picture} />
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
      childImageSharp {
        big: gatsbyImageData(
          width: 650
          height: 450
          transformOptions: { cropFocus: CENTER }
        )
      }
    }
    author {
      name
      links {
        url
        site
      }
      avatar {
        childImageSharp {
          gatsbyImageData(
            width: 40
            height: 40
            transformOptions: { cropFocus: CENTER }
            layout: FIXED
          )
        }
      }
    }
  }
`

export default Item
