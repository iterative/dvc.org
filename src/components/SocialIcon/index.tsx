import React from 'react'
import Link from '../Link'
import { ReactComponent as TwitterIcon } from './twitter.svg'
import { ReactComponent as GithubIcon } from './github.svg'
import { ReactComponent as LinkedInIcon } from './linkedin.svg'

const icons: { [site: string]: JSX.Element } = {
  linkedin: <LinkedInIcon />,
  github: <GithubIcon />,
  twitter: <TwitterIcon viewBox="5 5 30 30" />
}

export interface ISocialIcon {
  url: string
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
  className
}): JSX.Element | null => {
  /* eslint-disable-next-line */
  const icon: JSX.Element = icons[site!]
  return icon ? (
    <Link href={url} className={className} aria-label={site}>
      {icon}
    </Link>
  ) : null
}

export default SocialIcon
