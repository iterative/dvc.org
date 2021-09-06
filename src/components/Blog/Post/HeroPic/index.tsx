import Image from 'gatsby-image'
import React from 'react'

import { BLOG } from '../../../../consts'
import { IFluidObject } from '../../../../templates/blog-post'

import styles from './styles.module.css'

interface INonStretchedImageProps {
  fluid: IFluidObject
  style?: object
}

interface IHeroPicProps {
  picture: {
    fluid: IFluidObject
  }
  pictureComment?: string
}

const NonStretchedImage: React.FC<INonStretchedImageProps> = props => {
  let style = {}
  if (props.fluid && props.fluid.presentationWidth) {
    const presetantionWidth = props.fluid.presentationWidth
    const width =
      presetantionWidth < BLOG.imageMaxWidthHero
        ? presetantionWidth / 2
        : presetantionWidth
    style = {
      ...(props.style || {}),

      maxWidth: width,
      margin: '0 auto'
    }
  }

  return <Image style={style} {...props} />
}

const HeroPic: React.FC<IHeroPicProps> = ({ pictureComment, picture }) => {
  return (
    <div className={styles.pictureWrapper}>
      <div className={styles.picture}>
        <NonStretchedImage fluid={picture?.fluid} />
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
