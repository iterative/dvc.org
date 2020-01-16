import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'

import {
  Content,
  Description,
  Header,
  Icon,
  MobileDescription,
  Picture,
  Title,
  Wrapper
} from './styles'

export default function CommunitySection({
  anchor,
  background,
  color,
  contentVisible = false,
  children,
  description,
  icon,
  mobileDescription,
  title
}) {
  const [isContentVisible, setIsContentVisible] = useState(contentVisible)
  const toggleVisibility = useCallback(
    () => setIsContentVisible(!isContentVisible),
    [isContentVisible]
  )

  return (
    <Wrapper
      hasBg={!!background}
      id={anchor}
      isContentVisible={isContentVisible}
    >
      <Header color={color}>
        <Title onClick={toggleVisibility} isContentVisible={isContentVisible}>
          {title}
        </Title>
        <Icon src={icon} />
      </Header>
      <MobileDescription>{mobileDescription}</MobileDescription>
      <Description>{description}</Description>
      {background && <Picture src={background} />}
      <Content isContentVisible={isContentVisible}>{children}</Content>
    </Wrapper>
  )
}

CommunitySection.propTypes = {
  anchor: PropTypes.string,
  background: PropTypes.string,
  color: PropTypes.string,
  contentVisible: PropTypes.bool,
  children: PropTypes.node,
  description: PropTypes.string,
  icon: PropTypes.string,
  mobileDescription: PropTypes.string,
  title: PropTypes.string
}
