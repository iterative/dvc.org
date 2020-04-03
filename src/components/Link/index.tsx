import React from 'react'
import { useLocation, navigate } from '@reach/router'
import GatsbyLink from 'gatsby-link'
import { StyledComponentBase } from 'styled-components'
import { handleFrontRedirect } from '../../utils/redirects'
import { scrollIntoLayout } from '../../utils/scroll'

export type ILinkProps = {
  children: React.ReactNode
  className?: string
  as?: StyledComponentBase<React.ComponentClass, {}>
  href: string
  target?: undefined | '_blank'
  state?: unknown
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

const PROTOCOL_REGEXP = /^https?:\/\//
const isRelative = (url: string) => !PROTOCOL_REGEXP.test(url)
const getLocation = (href: string) => {
  const location = document.createElement('a')

  location.href = href

  return location
}

const Link: React.SFC<ILinkProps> = ({
  children,
  as: SC,
  href,
  target,
  ...restProps
}) => {
  const currentLocation = useLocation()

  if (!isRelative(href) || target) {
    const LinkComponent = SC ? SC : 'a'
    let rel = 'noopener noreferrer'

    if (restProps.rel) {
      rel = `${rel} ${restProps.rel}`
    }

    return (
      <LinkComponent href={href} rel={rel} target={target} {...restProps}>
        {children}
      </LinkComponent>
    )
  }

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (restProps.onClick) {
      restProps.onClick(e)
    }

    const location = getLocation(href)

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
  }

  // Navigate from @reach/router handles hash links incorrectly. Fix it
  if (href.startsWith('#')) {
    href = currentLocation.pathname + href
  }

  return SC ? (
    <SC to={href} {...restProps} as={GatsbyLink} onClick={onClick}>
      {children}
    </SC>
  ) : (
    <GatsbyLink to={href} {...restProps} onClick={onClick}>
      {children}
    </GatsbyLink>
  )
}

export default Link
