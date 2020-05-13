import React from 'react'

import LayoutWidthContainer from '../../LayoutWidthContainer'
import ShowOnly from '../../ShowOnly'
import Link, { ILinkProps } from '../../Link'
import { useCommunityData } from '../../../utils/front/community'
import { logEvent } from '../../../utils/front/ga'
import { scrollIntoLayout } from '../../../utils/front/scroll'

import styles from './styles.module.css'

const logHero = (): void => logEvent('community', 'hero')

export interface IHero {
  url: string
  pictureDesktop: string
  pictureMobile: string
}

// This special link component will smooth-scroll on local fragment links
const MaybeSmoothLink: React.FC<ILinkProps> = props => {
  const { href, children } = props
  if (href.startsWith('#')) {
    // Intercept local fragment links and turn them into a special
    // smooth-scrolling `a` element
    return (
      <Link
        {...props}
        onClick={(): void => {
          logHero()
          scrollIntoLayout(document.getElementById(href.slice(1)), {
            smooth: true
          })
        }}
      >
        {children}
      </Link>
    )
  } else {
    // Pass through all props to a normal link otherwise
    return <Link {...props} />
  }
}

const Hero: React.FC = () => {
  const { hero } = useCommunityData()

  if (!hero) {
    return null
  }

  return (
    <LayoutWidthContainer className={styles.container}>
      <MaybeSmoothLink
        className={styles.link}
        href={data.hero.url}
        onClick={logHero}
      >
        <ShowOnly on="desktop">
          <img className={styles.picture} src={hero.pictureDesktop} alt="" />
        </ShowOnly>
        <ShowOnly on="mobile">
          <img className={styles.picture} src={hero.pictureMobile} alt="" />
        </ShowOnly>
      </MaybeSmoothLink>
    </LayoutWidthContainer>
  )
}

export default Hero
