import React from 'react'
import GatsbyLink from 'gatsby-link'
import { StyledComponentBase } from 'styled-components'
import { handleFrontRedirect } from '../../utils/redirects'

export type ILinkProps = {
  children: React.ReactNode
  className?: string
  as?: StyledComponentBase<React.ComponentClass, {}>
  href: string
  target?: undefined | '_blank'
  state?: unknown
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

const Link: React.SFC<ILinkProps> = ({
  children,
  as: SC,
  href,
  target,
  ...restProps
}) => {
  if (!href?.startsWith('/') || target) {
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

    // Handle front redirects
    const nextLocation = document.createElement('a')

    nextLocation.href = href
    handleFrontRedirect(nextLocation.host, nextLocation.pathname, e)
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
