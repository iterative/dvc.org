import React from 'react'
import PropTypes from 'prop-types'

import { Line, Wrapper } from './styles'

export default function Hamburger({ open }) {
  return (
    <Wrapper>
      <Line first open={open} />
      <Line second open={open} />
      <Line third open={open} />
    </Wrapper>
  )
}

Hamburger.propTypes = {
  open: PropTypes.bool
}
