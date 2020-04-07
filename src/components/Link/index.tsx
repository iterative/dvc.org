import React, { useCallback } from 'react'
import { URL } from 'iso-url'
import { useLocation, navigate } from '@reach/router'
import GatsbyLink from 'gatsby-link'
import { getRedirect, handleFrontRedirect } from '../../utils/shared/redirects'
import { scrollIntoLayout } from '../../utils/front/scroll'

export type ILinkProps = {
  children: React.ReactNode
  className?: string
  href: string
  target?: undefined | '_blank'
  state?: unknown
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

const PROTOCOL_REGEXP = /^https?:\/\//
const isRelative = (url: string) => !PROTOCOL_REGEXP.test(url)

const ResultLinkComponent: React.SFC<ILinkProps> = ({
  href,
  children,
  ...restProps
}) => {
  if (!isRelative(href) || restProps.target) {
    let rel = 'noopener noreferrer'

    if (restProps.rel) {
      rel = `${rel} ${restProps.rel}`
    }

    return (
      <a href={href} rel={rel} {...restProps}>
        {children}
      </a>
    )
  }

  return (
    <GatsbyLink to={href} {...restProps}>
      {children}
    </GatsbyLink>
  )
}

const Link: React.SFC<ILinkProps> = ({ href, ...restProps }) => {
  const currentLocation = useLocation()
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (restProps.onClick) {
        restProps.onClick(e)
      }

      const location = new URL(href)

      // Do not navigate to the same page. Handle hash scrolling manually
      if (
        currentLocation.host === location.host &&
        currentLocation.pathname === location.pathname
      ) {
        e.preventDefault()

        if (currentLocation.hash !== location.hash) {
          navigate(href)
        } else if (location.hash) {
          scrollIntoLayout(document.querySelector(location.hash))
        } else {
          document.documentElement.scrollTop = 0
        }
      }

      // Handle front redirects
      handleFrontRedirect(location.host, location.pathname, e)
    },
    [restProps.onClick, currentLocation]
  )

  const location = new URL(href)
  // Navigate from @reach/router handles hash links incorrectly. Fix it
  if (href.startsWith('#')) {
    href = currentLocation.pathname + href
  }

  // Replace link href with redirect if it exists
  const [, redirectUrl] = getRedirect(location.host, location.pathname)
  if (redirectUrl) {
    href = isRelative(redirectUrl)
      ? redirectUrl + currentLocation.search
      : redirectUrl
  }

  return <ResultLinkComponent href={href} {...restProps} onClick={onClick} />
}

export default Link
