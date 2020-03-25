import React from 'react'
import GatsbyLink from 'gatsby-link'
import { StyledComponentBase } from 'styled-components'

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
    return (
      <a href={href} rel="noopener noreferrer" target={target} {...restProps}>
        {children}
      </a>
    )
  }

  return SC ? (
    <SC to={href} {...restProps} as={GatsbyLink}>
      {children}
    </SC>
  ) : (
    <GatsbyLink to={href} {...restProps}>
      {children}
    </GatsbyLink>
  )
}

export default Link
