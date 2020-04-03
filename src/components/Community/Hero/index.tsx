import React from 'react'

import LayoutWidthContainer from '../../LayoutWidthContainer'
import ShowOnly from '../../ShowOnly'
import Link from '../../Link'
import { logEvent } from '../../../utils/ga'

import data from '../data.json'
import styles from './styles.module.css'

const logHero = () => logEvent('community', 'hero')

const Hero: React.SFC = () => {
  if (!data.hero) {
    return null
  }

  return (
    <LayoutWidthContainer className={styles.container}>
      <Link
        className={styles.link}
        href={data.hero.url}
        target="_blank"
        onClick={logHero}
      >
        <ShowOnly on="desktop">
          <img
            className={styles.picture}
            src={data.hero.pictureDesktop}
            alt=""
          />
        </ShowOnly>
        <ShowOnly on="mobile">
          <img
            className={styles.picture}
            src={data.hero.pictureMobile}
            alt=""
          />
        </ShowOnly>
      </Link>
    </LayoutWidthContainer>
  )
}

export default Hero
