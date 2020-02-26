import React from 'react'
import PropTypes from 'prop-types'

import GatsbyLink from 'gatsby-link'

export default function LocalLink({
  children,
  as: SC,
  href: to,
  ...restProps
}) {
  const Component = SC ? SC.withComponent(GatsbyLink) : GatsbyLink

  return (
    <Component to={to} {...restProps}>
      {children}
    </Component>
  )
}

LocalLink.propTypes = {
  children: PropTypes.node,
  as: PropTypes.object,
  href: PropTypes.string
}
