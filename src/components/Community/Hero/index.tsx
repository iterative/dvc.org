import React from 'react'

import LayoutWidthContainer from '../../LayoutWidthContainer'
import ShowOnly from '../../ShowOnly'
import Link, { ILinkProps } from '../../Link'
import { logEvent } from '../../../utils/front/ga'
import { scrollIntoLayout } from '../../../utils/front/scroll'

import data from '../data.json'
import styles from './styles.module.css'

const logHero = (): void => logEvent('community', 'hero')

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
  if (!data.hero) {
    return null
  }

  return (
    <LayoutWidthContainer className={styles.container}>
      <MaybeSmoothLink className={styles.link} href={data.hero.url}>
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
      </MaybeSmoothLink>
    </LayoutWidthContainer>
  )
}

export default Hero
