import React from 'react'
import PropTypes from 'prop-types'

import { Wrapper } from './styles'

export default function Button({ theme, children, ...props }) {
  return (
    <Wrapper {...props} {...theme}>
      {children}
    </Wrapper>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string
  })
}
