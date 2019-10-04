import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'

import Modal from '../Modal'
import { HighlightedText } from './index'

class DesktopView extends Component {
  state = {
    hover: false,
    width: 400
  }

  tooltipPositionEval = () => {
    const headerHeight = document.getElementsByClassName('header')[0]
      .offsetHeight
    const tooltipBoundary = document
      .getElementById(`tooltip-text-${this.props.id}`)
      .getBoundingClientRect()
    const container = document.getElementsByClassName('tooltip-container')[0]
    const tooltipBoxHeight = container.offsetHeight
    const tooltipHeight = tooltipBoundary.top - tooltipBoxHeight
    const maxWidth = document.getElementById('bodybag').clientWidth
    const tooltipWidth = tooltipBoundary.left + this.state.width
    const vertical = tooltipHeight > headerHeight ? 'top' : 'bottom'
    const horizontal = tooltipWidth > maxWidth ? 'right' : 'left'

    switch (`${horizontal} ${vertical}`) {
      case 'left top':
        this.setState({
          marginLeft: tooltipBoundary.left - 50,
          pointBorderColorAfter: 'white transparent transparent transparent',
          pointBorderColorBefore: '#d1d5da transparent transparent transparent',
          pointBottom: 'unset',
          pointHorizontalPosition: 55,
          pointTop: tooltipBoxHeight - 2,
          top: tooltipHeight - 6
        })
        break
      case 'right top':
        this.setState({
          marginLeft: tooltipBoundary.left - 320,
          pointBorderColorAfter: 'white transparent transparent transparent',
          pointBorderColorBefore: '#d1d5da transparent transparent transparent',
          pointBottom: 'unset',
          pointHorizontalPosition: tooltipBoundary.width + 290,
          pointTop: tooltipBoxHeight - 2,
          top: tooltipHeight - 6
        })
        break
      case 'left bottom':
        this.setState({
          marginLeft: tooltipBoundary.left - 50,
          pointBorderColorAfter: 'transparent transparent white transparent',
          pointBorderColorBefore: 'transparent transparent #d1d5da transparent',
          pointBottom: tooltipBoxHeight - 2,
          pointHorizontalPosition: 55,
          pointTop: 'unset',
          top: tooltipBoundary.top + 40
        })
        break
      case 'right bottom':
        this.setState({
          marginLeft: tooltipBoundary.left - 320,
          pointBorderColorAfter: 'transparent transparent white transparent',
          pointBorderColorBefore: 'transparent transparent #d1d5da transparent',
          pointBottom: tooltipBoxHeight - 2,
          pointHorizontalPosition: tooltipBoundary.width + 290,
          pointTop: 'unset',
          top: tooltipBoundary.top + 40
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
          <Modal>
            <TooltipContainer
              className="tooltip-container"
              // events
              onMouseOver={this.hoverIn}
              onFocus={this.hoverIn}
              onMouseLeave={this.hoverOut}
              onBlur={this.hoverOut}
              // styles
              marginLeft={this.state.marginLeft}
              pointBorderColorAfter={this.state.pointBorderColorAfter}
              pointBorderColorBefore={this.state.pointBorderColorBefore}
              pointBottom={this.state.pointBottom}
              pointHorizontalPosition={this.state.pointHorizontalPosition}
              pointTop={this.state.pointTop}
              top={this.state.top}
              width={this.state.width}
            >
              <div className="header">{this.props.header}</div>
              <ReactMarkdown
                className="markdown-body portal-font"
                source={this.props.description}
              />
            </TooltipContainer>
          </Modal>
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

const TooltipContainer = styled.div`
  background-color: white;
  width: ${props => props.width}px;
  padding: 8px 10px;
  border: 1px solid #d1d5da;
  border-radius: 3px;
  position: absolute;
  top: ${props => props.top}px;
  margin-left: ${props => props.marginLeft}px;

  .header {
    font-size: 1.3em;
    font-weight: bold;
  }

  .portal-font {
    font-family: BrandonGrotesque;
  }

  &:after,
  &:before {
    left: ${props => props.pointHorizontalPosition}px;
    content: '';
    position: absolute;
    border-style: solid;
  }

  &:after {
    top: ${props =>
      props.pointTop === 'unset' ? 'unset' : `${props.pointTop}px`};
    bottom: ${props =>
      props.pointBottom === 'unset' ? 'unset' : `${props.pointBottom}px`};
    border-width: 10px;
    border-color: ${props => props.pointBorderColorAfter};
  }
  /*
  * 1 is added to give the shadow effect to the pointer.
  */
  &:before {
    top: ${props =>
      props.pointTop === 'unset' ? 'unset' : `${props.pointTop + 1}px`};
    bottom: ${props =>
      props.pointBottom === 'unset' ? 'unset' : `${props.pointBottom + 1}px`};
    border-width: 11px;
    border-color: ${props => props.pointBorderColorBefore};
  }
`

DesktopView.propTypes = {
  description: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired
}

export default DesktopView
