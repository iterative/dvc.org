import React from 'react'
import PropTypes from 'prop-types'

import NextLink from 'next/link'

import { PAGE_DOC } from '../../consts'

export default function LocalLink({
  children,
  as: Component,
  href,
  ...restProps
}) {
  const nextProps = href.match(/^\/doc/)
    ? { href: PAGE_DOC, as: href }
    : { href }

  return (
    <NextLink {...nextProps} passHref>
      {Component ? (
        <Component {...restProps}>{children}</Component>
      ) : (
        <a {...restProps}>{children}</a>
      )}
    </NextLink>
  )
}

LocalLink.propTypes = {
  children: PropTypes.node,
  as: PropTypes.object,
  href: PropTypes.string
}
