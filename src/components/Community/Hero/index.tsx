import React from 'react'

import LayoutWidthContainer from '../../LayoutWidthContainer'
import ShowOnly from '../../ShowOnly'
import Link from '../../Link'
import { logEvent } from '../../../utils/front/ga'

import data from '../data.json'
import styles from './styles.module.css'

const logHero = (): void => logEvent('community', 'hero')

const Hero: React.FC = () => {
  if (!data.hero) {
    return null
  }

  return (
    <LayoutWidthContainer className={styles.container}>
      <Link className={styles.link} href={data.hero.url} onClick={logHero}>
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
