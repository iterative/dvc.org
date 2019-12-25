import PropTypes from 'prop-types'
import React from 'react'

import {
  Content,
  Description,
  Header,
  Icon,
  Picture,
  Title,
  Wrapper
} from './styles'

export default function CommunitySection({
  anchor,
  background,
  color,
  children,
  description,
  icon,
  title
}) {
  return (
    <Wrapper hasBg={!!background} id={anchor}>
      <Header color={color}>
        <Title>{title}</Title>
        <Icon src={icon} />
      </Header>
      <Description>{description}</Description>
      {background && <Picture src={background} />}
      <Content>{children}</Content>
    </Wrapper>
  )
}

CommunitySection.propTypes = {
  anchor: PropTypes.string,
  background: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
  description: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string
}
