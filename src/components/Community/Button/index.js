import React from 'react'
import PropTypes from 'prop-types'

import { Wrapper } from './styles'

function CommunityButton({ theme, children, forwardedRef, ...props }) {
  return (
    <Wrapper {...props} {...theme} ref={forwardedRef}>
      {children}
    </Wrapper>
  )
}

CommunityButton.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.shape({
    backgroundColor: PropTypes.string,
    color: PropTypes.string
  }),
  forwardedRef: PropTypes.func
}

// eslint-disable-next-line react/display-name
export default React.forwardRef((props, ref) => (
  <CommunityButton {...props} forwardedRef={ref} />
))
