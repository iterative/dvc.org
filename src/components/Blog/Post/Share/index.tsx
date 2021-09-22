import { graphql, useStaticQuery } from 'gatsby'
import React, { useCallback } from 'react'

import Link from '../../../Link'
import Tooltip from '../Tooltip'

import { ReactComponent as Facebook } from './icons/facebook.svg'
import { ReactComponent as Subscribe } from './icons/subscribe.svg'
import { ReactComponent as Twitter } from './icons/twitter.svg'

import styles from './styles.module.css'

function openWindow(e: React.MouseEvent, href: string): void {
  e.preventDefault()

  window.open(
    href,
    '',
    'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
  )
}

interface IShareProps {
  className?: string
  text: string
  slug: string
}

const Share: React.FC<IShareProps> = ({ className, text, slug }) => {
  const {
    site: {
      siteMetadata: { siteUrl }
    }
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            siteUrl
          }
        }
      }
    `
  )

  const encodedURL = encodeURI(`${siteUrl}${slug}`)

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`
  const twitterHref = `https://twitter.com/share?url=${encodedURL}&via=DVCorg&text=${text}`

  const onClickFacebook = useCallback(
    (e: React.MouseEvent) => openWindow(e, facebookHref),
    [facebookHref]
  )

  const onClickTwitter = useCallback(
    (e: React.MouseEvent) => openWindow(e, twitterHref),
    [twitterHref]
  )

  return (
    <div className={className}>
      <Link
        href={facebookHref}
        onClick={onClickFacebook}
        target="_blank"
        className={styles.link}
      >
        <Tooltip label="Share on Facebook">
          <Facebook />
        </Tooltip>
      </Link>
      <Link
        href={twitterHref}
        onClick={onClickTwitter}
        target="_blank"
        className={styles.link}
      >
        <Tooltip label="Share on Twitter">
          <Twitter />
        </Tooltip>
      </Link>
      <Link href={`#subscribe`} className={styles.link}>
        <Tooltip label="Subscribe to maillist">
          <Subscribe />
        </Tooltip>
      </Link>
    </div>
  )
}

export default Share
