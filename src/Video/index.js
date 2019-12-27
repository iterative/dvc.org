import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { logEvent } from '../utils/ga'
import styled from 'styled-components'

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

const Wrapper = styled.div`
  width: 100%;
`

const Handler = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  overflow: hidden;
  background: #000;

  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;

  background-color: rgba(23, 23, 23, 0.59);

  @media (max-width: 768px) {
    width: 100%;
  }

  iframe,
  object,
  embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .ytplayer {
      pointer-events: none;
      position: absolute;
    }
  }
`

const Overflow = styled.div`
  position: absolute;
  z-index: 1;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: rgba(23, 23, 23, 0.59);
  display: flex;
  align-items: center;
  justify-content: center;
`

const Box = styled.div`
  width: 186px;
  height: 60px;
`

const Button = styled.button`
  cursor: pointer;
  align-items: center;
  width: 100%;
  height: 60px;
  border-radius: 4px;
  border: none;

  display: flex;
  flex-direction: row;
  padding: 0px;

  text-decoration: none;
  color: #ffffff;
  border: none;
  background-color: #13adc7;

  &:hover {
    background-color: #13a3bd;
  }

  ${props =>
    props.disabled &&
    `
    background-color: #b0b8c5;
    &:hover {
      background-color: #b0b8c5;
    }
  `};
`

const ButtonIcon = styled.div`
  flex-basis: 48px;

  text-align: center;
  padding-top: 4px;
`

const ButtonInner = styled.div``
const Action = styled.h6`
  font-family: BrandonGrotesqueMed, Tahoma, Arial;
  font-size: 20px;
  font-weight: 500;
  line-height: 0.9;
`
const Description = styled.p`
  font-size: 12px;
  text-align: left;
  line-height: 1.29;
`
