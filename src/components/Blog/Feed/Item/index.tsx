import cn from 'classnames'
import { graphql } from 'gatsby'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'
import { useEffect, useRef } from 'react'
import { useRafState, useWindowSize } from 'react-use'

import FeedMeta from '@/components/Blog/FeedMeta'

import { IAuthor } from '@/templates/blog-post'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'

import { ReactComponent as Placeholder } from './placeholder.svg'
import * as styles from './styles.module.css'

export interface IBlogPostData {
  id: string
  slug: string
  title: string
  date: string
  description: string
  author: IAuthor
  contributors?: IAuthor[]
  parent: {
    timeToRead: string
  }
  picture?: {
    childImageSharp: {
      big: IGatsbyImageData
    }
  }
}

interface IBlogFeedItemProps {
  big?: boolean
  feedPost: IBlogPostData
}

const Item: React.FC<IBlogFeedItemProps> = ({
  big,
  feedPost: {
    title,
    description,
    date,
    picture,
    author,
    contributors,
    slug,
    parent: { timeToRead }
  }
}) => {
  const image = picture?.childImageSharp.big
  const bodyRef = useRef<HTMLDivElement>(null)
  const { width } = useWindowSize()
  const [isOverflown, setIsOverflown] = useRafState(true)

  useEffect(() => {
    if (bodyRef.current) {
      const { scrollHeight, clientHeight } = bodyRef.current

      setIsOverflown(scrollHeight <= clientHeight)
    }
  }, [setIsOverflown, width])

  return (
    <div className={cn(styles.wrapper, big && styles.big)}>
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
          author={author}
          contributors={contributors}
          date={date}
          timeToRead={timeToRead}
        />
      </div>
    </div>
  )
}

export const query = graphql`
  fragment FeedPost on BlogPost {
    id
    slug
    date(formatString: "MMM DD, YYYY")
    title
    description
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
    parent {
      ... on MarkdownRemark {
        timeToRead
      }
    }
  }
`

export default Item
