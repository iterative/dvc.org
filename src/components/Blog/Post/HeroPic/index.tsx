import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { IGatsbyImageDataParent } from 'gatsby-plugin-image/dist/src/components/hooks'
import React from 'react'

import { IBlogPostHeroPic } from '../../../../templates/blog-post'

import * as styles from './styles.module.css'

const HeroPic: React.FC<IBlogPostHeroPic> = ({ pictureComment, picture }) => {
  const image = getImage(picture as IGatsbyImageDataParent)
  return (
    <div className={styles.pictureWrapper}>
      {image && (
        <div className={styles.picture}>
          <GatsbyImage image={image} alt="Hero Picture" />
        </div>
      )}
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
