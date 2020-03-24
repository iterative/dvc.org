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
  ...restProps
}) => {
  if (!href?.startsWith('/')) {
    return (
      <a href={href} rel="noopener noreferrer" {...restProps}>
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
