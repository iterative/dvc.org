import React from 'react'
import PropTypes from 'prop-types'

import GatsbyLink from 'gatsby-link'

export default function LocalLink({ children, as: SC, href, ...restProps }) {
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

LocalLink.propTypes = {
  children: PropTypes.node,
  as: PropTypes.object,
  href: PropTypes.string
}
