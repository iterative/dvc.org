import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { logEvent } from '../../utils/ga'

import {
  Button,
  ButtonIcon,
  ButtonInner,
  Action,
  Description,
  Overflow,
  Box,
  Wrapper,
  Handler
} from './styles'

const WatchButton = ({ onClick, disabled }) => (
  <Button onClick={onClick} disabled={disabled}>
    <ButtonIcon>
      <img
        src="/img/watch_white.svg"
        alt="Watch video"
        width={20}
        height={20}
      />
    </ButtonIcon>
    <ButtonInner>
      <Action>Watch video</Action>
      <Description>How it works</Description>
    </ButtonInner>
  </Button>
)

WatchButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}

export default class Video extends Component {
  state = {
    ready: false,
    watching: false
  }

  componentDidMount() {
    this.setState({
      ready: true
    })
  }

  watch = () => {
    logEvent('button', 'video')
    this.setState({ watching: true })
    this.play()
  }

  play = () => {}

  onPause = () => {
    this.setState({ watching: false })
  }

  renderOverflow() {
    const { ready } = this.state

    return (
      <Overflow>
        <Box>
          <WatchButton onClick={this.watch} disabled={!ready} />
        </Box>
      </Overflow>
    )
  }

  render() {
    const { id } = this.props
    const { watching } = this.state

    const playing = watching ? `&autoplay=1` : ''

    return (
      <Wrapper>
        <Handler>
          {!watching && this.renderOverflow()}
          <iframe
            title="Video"
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${id}?rel=0&amp;controls=0&amp;showinfo=0;${playing}`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </Handler>
      </Wrapper>
    )
  }
}

Video.propTypes = {
  id: PropTypes.string.isRequired
}
