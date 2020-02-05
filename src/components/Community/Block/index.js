import React from 'react'
import PropTypes from 'prop-types'

import { Action, Content, Icon, Header, Wrapper } from './styles'

export default function Block({ action, children, icon, title }) {
  const hasAction = !!action

  return (
    <Wrapper>
      {title && (
        <Header>
          {title}
          {icon && <Icon src={icon} />}
        </Header>
      )}
      <Content>{children}</Content>
      {hasAction && <Action>{action}</Action>}
    </Wrapper>
  )
}

Block.propTypes = {
  action: PropTypes.node,
  children: PropTypes.node,
  icon: PropTypes.string,
  title: PropTypes.string
}
