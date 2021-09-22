import { GatsbyImage } from 'gatsby-plugin-image'
import React from 'react'

import { BLOG } from '../../../../consts'
import {
  IBlogPostHeroPic,
  IGatsbyImageProps
} from '../../../../templates/blog-post'

import * as styles from './styles.module.css'

const NonStretchedImage: React.FC<IGatsbyImageProps> = props => {
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
  return <GatsbyImage {...normalizedProps} />
}

const HeroPic: React.FC<IBlogPostHeroPic> = ({ pictureComment, picture }) => {
  return (
    <div className={styles.pictureWrapper}>
      <div className={styles.picture}>
        <NonStretchedImage image={picture.gatsbyImageData} />
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
