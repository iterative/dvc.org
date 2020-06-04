import React, { ReactElement } from 'react'
import Link from '../Link'
import styles from './styles.module.css'
import { ReactComponent as TwitterIcon } from './twitter.svg'
import { ReactComponent as GithubIcon } from './github.svg'
import { ReactComponent as LinkedInIcon } from './linkedin.svg'

const icons: { [site: string]: ReactElement } = {
  linkedin: <LinkedInIcon />,
  github: <GithubIcon />,
  twitter: <TwitterIcon viewBox="5 5 30 30" />
}

export interface ISocialIcon {
  url: string
  username: string
  site?: string
}

export interface ISocialIconProps extends ISocialIcon {
  className?: string
}

/*
   Returns a link containing an icon corresponding to the provided site

   Given the situation where either the given link has no site or we don't have
   an icon for it, we return null such that nothing is rendered in map
   functions.
*/
const SocialIcon: React.FC<ISocialIconProps> = ({
  site,
  url,
  username,
  className = styles.default
}) => {
  /* eslint-disable-next-line */
  const icon: JSX.Element = icons[site!]
  return icon ? (
    <Link href={url} aria-label={site} className={styles.link}>
      <p>{username}</p>
      <div className={className}>{icon}</div>
    </Link>
  ) : null
}

// A simple wrapper to render multiple icons from an array
export const SocialIcons: React.FC<{
  className?: string
  links: Array<ISocialIconProps>
}> = ({ links, className }) => (
  <>
    {links.map(({ site, url, username }, i) => (
      <SocialIcon
        className={className}
        site={site}
        username={username}
        url={url}
        key={i}
      />
    ))}
  </>
)

export default SocialIcon
