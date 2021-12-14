import React from 'react'

import LayoutWidthContainer from '../../LayoutWidthContainer'
import ShowOnly from '../../ShowOnly'
import Link from '../../Link'
import { useCommunityData } from '../../../utils/front/community'
import { logEvent } from '../../../utils/front/ga'

import * as styles from './styles.module.css'

const logHero = (): void => logEvent('community', 'hero')

export interface IHero {
  url: string
  pictureDesktop: string
  pictureMobile: string
}

const Hero: React.FC = () => {
  const { hero } = useCommunityData()

  if (!hero) {
    return null
  }

  return (
    <LayoutWidthContainer className={styles.container}>
      <Link
        className={styles.link}
        href={hero.url}
        onClick={logHero}
        scrollOptions={{
          smooth: true
        }}
      >
        <ShowOnly on="desktop">
          <div className={styles.pictureContainer}>
            <img className={styles.picture} src={hero.pictureDesktop} alt="" />
          </div>
        </ShowOnly>
        <ShowOnly on="mobile">
          <div className={styles.pictureContainer}>
            <img className={styles.picture} src={hero.pictureMobile} alt="" />
          </div>
        </ShowOnly>
      </Link>
    </LayoutWidthContainer>
  )
}

export default Hero
