import LayoutWidthContainer from '@dvcorg/gatsby-theme-iterative/src/components/LayoutWidthContainer'
import Link from '@dvcorg/gatsby-theme-iterative/src/components/Link'
import ShowOnly from '@dvcorg/gatsby-theme-iterative/src/components/ShowOnly'
import { logEvent } from '@dvcorg/gatsby-theme-iterative/src/utils/front/plausible'

import { useCommunityData } from '../../../utils/front/community'

import * as styles from './styles.module.css'

const logHero = (): void => logEvent('Community', { Section: 'hero' })

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
      <Link className={styles.link} href={hero.url} onClick={logHero}>
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
