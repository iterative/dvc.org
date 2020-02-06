import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import Collapse from 'react-collapse'
import { presets } from 'react-motion'
import { useWindowSize } from 'react-use'

import {
  DesktopDescription,
  Header,
  Icon,
  MobileDescription,
  Picture,
  Title,
  Wrapper
} from './styles'
import { sizes } from '../../../styles'

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
  const { width } = useWindowSize()

  const isTablet = width <= sizes.tablet

  return (
    <Wrapper
      hasBg={!!background}
      id={anchor}
      isContentVisible={isContentVisible}
    >
      <Header color={color} onClick={toggleVisibility}>
        <Icon src={icon} />
        <div>
          <Title isContentVisible={isContentVisible}>{title}</Title>
          <DesktopDescription>{description}</DesktopDescription>
          <MobileDescription>{mobileDescription}</MobileDescription>
        </div>
      </Header>
      {background && <Picture src={background} />}

      {isTablet ? (
        <Collapse isOpened={isContentVisible} springConfig={presets.gentle}>
          {children}
        </Collapse>
      ) : (
        children
      )}
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
