import Image from 'gatsby-image'
import React from 'react'

import { BLOG } from '../../../../consts'
import {
  IBlogPostHeroPic,
  IGatsbyImageProps
} from '../../../../templates/blog-post'

import styles from './styles.module.css'

function NonStretchedImage(props: IGatsbyImageProps) {
  let normalizedProps = props
  if (props.fluid && props.fluid.presentationWidth) {
    const presetantionWidth = props.fluid?.presentationWidth
    const width =
      presetantionWidth < BLOG.imageMaxWidthHero
        ? presetantionWidth / 2
        : presetantionWidth
    normalizedProps = {
      ...props,
      style: {
        ...(props.style || {}),
        maxWidth: width,
        margin: '0 auto'
      }
    }
  }
  return <Image {...normalizedProps} />
}

function HeroPic({ pictureComment, picture }: IBlogPostHeroPic) {
  return (
    <div className={styles.pictureWrapper}>
      <div className={styles.picture}>
        <NonStretchedImage fluid={picture?.childImageSharp.fluid} />
      </div>
      {pictureComment && (
        <div
          className={styles.pictureComment}
          dangerouslySetInnerHTML={{ __html: pictureComment }}
        />
      )}
    </div>
  )
}

export default HeroPic
