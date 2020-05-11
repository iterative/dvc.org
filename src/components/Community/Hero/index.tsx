import React from 'react'

import LayoutWidthContainer from '../../LayoutWidthContainer'
import ShowOnly from '../../ShowOnly'
import Link from '../../Link'
import { isExpired } from '../../../utils/shared/expiration.js'
import { logEvent } from '../../../utils/front/ga'

import data from '../../../../content/community.json'
import styles from './styles.module.css'

const logHero = (): void => logEvent('community', 'hero')

const Hero: React.FC = () => {
  if (!data.hero) {
    return null
  }

  return isExpired(data.hero) ? null : (
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
