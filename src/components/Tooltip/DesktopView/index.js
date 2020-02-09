import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'

import { HEADER } from '../../../consts'

import { HighlightedText, TooltipContainer, TooltipText } from './styles'

export default class DesktopView extends Component {
  state = {
    hover: false,
    margin: -70,
    pointBorderAfter: 'white transparent transparent transparent',
    pointBorderBefore: '#d1d5da transparent transparent transparent',
    pointMargin: -15,
    pointTop: 100,
    pointTopAfter: -14,
    pointTopBefore: 16,
    top: 'unset',
    width: 400
  }

  tooltipPositionEval = () => {
    const headerHeight = document.getElementById(HEADER).offsetHeight
    const markdownBody = document.getElementById('markdown-root')
    const tooltipBoundary = document
      .getElementById(`tooltip-text-${this.props.id}`)
      .getBoundingClientRect()
    const tooltipBoxHeight = document.getElementById(
      `tooltip-box-${this.props.id}`
    ).offsetHeight
    const tooltipHeight = tooltipBoundary.top - tooltipBoxHeight
    const maxWidth = markdownBody.offsetLeft + markdownBody.clientWidth
    const container = document.getElementById(
      `tooltip-container-${this.props.id}`
    )
    const tooltipWidth = container.offsetLeft + this.state.width
    const vertical = tooltipHeight > headerHeight ? 'top' : 'bottom'
    const horizontal = tooltipWidth > maxWidth ? 'right' : 'left'

    switch (`${horizontal} ${vertical}`) {
      case 'left top':
        this.setState({
          margin: -10,
          pointBorderAfter: 'white transparent transparent transparent',
          pointBorderBefore: '#d1d5da transparent transparent transparent',
          pointMargin: -15,
          pointTop: 100,
          pointTopAfter: 'unset',
          pointTopBefore: 'unset',
          top: -tooltipBoxHeight - 5
        })
        break
      case 'right top':
        this.setState({
          margin: -290,
          pointBorderAfter: 'white transparent transparent transparent',
          pointBorderBefore: '#d1d5da transparent transparent transparent',
          pointMargin: 260,
          pointTop: 100,
          pointTopAfter: 'unset',
          pointTopBefore: 'unset',
          top: -tooltipBoxHeight - 5
        })
        break
      case 'left bottom':
        this.setState({
          margin: -10,
          pointBorderAfter: 'transparent transparent white transparent',
          pointBorderBefore: 'transparent transparent #d1d5da transparent',
          pointMargin: -15,
          pointTop: -15,
          pointTopAfter: -20,
          pointTopBefore: -23,
          top: 40
        })
        break
      case 'right bottom':
        this.setState({
          margin: -290,
          pointBorderAfter: 'transparent transparent white transparent',
          pointBorderBefore: 'transparent transparent #d1d5da transparent',
          pointMargin: 260,
          pointTop: -15,
          pointTopAfter: -20,
          pointTopBefore: -23,
          top: 40
        })
        break
    }
  }
  hoverIn = () => {
    if (this.state.interval) {
      clearTimeout(this.state.interval)
      this.setState(
        {
          interval: null,
          hover: true
        },
        this.tooltipPositionEval
      )
    } else {
      this.setState(
        {
          hover: true
        },
        this.tooltipPositionEval
      )
    }
  }

  hoverOut = () => {
    this.setState({
      interval: setTimeout(() => {
        this.setState({
          hover: false
        })
      }, 100)
    })
  }

  render() {
    return (
      <>
        {this.state.hover && (
          <TooltipContainer
            id={`tooltip-container-${this.props.id}`}
            onMouseOver={this.hoverIn}
            onFocus={this.hoverIn}
            onMouseLeave={this.hoverOut}
            onBlur={this.hoverOut}
          >
            <TooltipText
              id={`tooltip-box-${this.props.id}`}
              margin={this.state.margin}
              width={this.state.width}
              pointBorderAfter={this.state.pointBorderAfter}
              pointBorderBefore={this.state.pointBorderBefore}
              pointMargin={this.state.pointMargin}
              pointTop={this.state.pointTop}
              pointTopBefore={this.state.pointTopBefore}
              pointTopAfter={this.state.pointTopAfter}
              top={this.state.top}
              bottom={this.state.bottom}
            >
              <div className="header">{this.props.header}</div>
              <ReactMarkdown source={this.props.description} />
            </TooltipText>
          </TooltipContainer>
        )}
        <HighlightedText
          id={`tooltip-text-${this.props.id}`}
          onMouseOver={this.hoverIn}
          onMouseLeave={this.hoverOut}
          onFocus={this.hoverIn}
          onBlur={this.hoverOut}
        >
          {this.props.text}
        </HighlightedText>
      </>
    )
  }
}

DesktopView.propTypes = {
  description: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired
}
