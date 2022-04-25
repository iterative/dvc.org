import { GatsbyImage } from 'gatsby-plugin-image'
import React from 'react'

import { IBlogPostHeroPic } from '../../../../templates/blog-post'

import * as styles from './styles.module.css'

const HeroPic: React.FC<IBlogPostHeroPic> = ({ pictureComment, picture }) => {
  return (
    <div className={styles.pictureWrapper}>
      {picture && (
        <div className={styles.picture}>
          <GatsbyImage image={picture} alt="Hero Picture" />
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
