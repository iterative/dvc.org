import PropTypes from 'prop-types'
import React from 'react'

import { Content, Description, Header, Icon, Title, Wrapper } from './styles'

export default function CommunitySection({
  background,
  color,
  children,
  description,
  icon,
  title
}) {
  return (
    <Wrapper background={background}>
      <Header color={color}>
        <Title>{title}</Title>
        <Icon src={icon} />
      </Header>
      <Description>{description}</Description>
      <Content>{children}</Content>
    </Wrapper>
  )
}

CommunitySection.propTypes = {
  background: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
  description: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string
}
