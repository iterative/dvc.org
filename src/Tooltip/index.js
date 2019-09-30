import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import includes from 'lodash.includes'

import glossary from '../Documentation/glossary'
import { OnlyDesktop, OnlyMobile } from '../styles'

/**
 * @param {Number} MARGIN Control horizontal position of tooltip box
 * @param {String} POINT_BORDER_AFTER Control direction and color of pointer
 * @param {String} POINT_BORDER_BEFORE Control direction and color of pointer's
 * shadow
 * @param {Number} POINT_MARGIN Control horizontal position of pointer
 * @param {Number} POINT_TOP Control vertical position of pointer
 * @param {Number} TOP Control vertical position of tooltip box
 * @param {Number} WIDTH Control width of tooltip box
 * @param {Number} POINT_TOP_AFTER Control pointer's alignment with its shadow
 * @param {Number} POINT_TOP_BEFORE Control shadow's alignment with its pointer
 */

const WIDTH = 400

const LEFT_TOP = {
  MARGIN: -10,
  POINT_BORDER_AFTER: 'white transparent transparent transparent',
  POINT_BORDER_BEFORE: '#d1d5da transparent transparent transparent',
  POINT_MARGIN: -15,
  POINT_TOP: 100,
  POINT_TOP_AFTER: 'unset',
  POINT_TOP_BEFORE: 'unset',
  TOP: 'unset'
}

const RIGHT_TOP = {
  MARGIN: -290,
  POINT_BORDER_AFTER: 'white transparent transparent transparent',
  POINT_BORDER_BEFORE: '#d1d5da transparent transparent transparent',
  POINT_MARGIN: 260,
  POINT_TOP: 100,
  POINT_TOP_AFTER: 'unset',
  POINT_TOP_BEFORE: 'unset'
}

const LEFT_BOTTOM = {
  MARGIN: -10,
  POINT_BORDER_AFTER: 'transparent transparent white transparent',
  POINT_BORDER_BEFORE: 'transparent transparent #d1d5da transparent',
  POINT_MARGIN: -15,
  POINT_TOP: -15,
  POINT_TOP_AFTER: -20,
  POINT_TOP_BEFORE: -23,
  TOP: 40
}

const RIGHT_BOTTOM = {
  MARGIN: -290,
  POINT_BORDER_AFTER: 'transparent transparent white transparent',
  POINT_BORDER_BEFORE: 'transparent transparent #d1d5da transparent',
  POINT_MARGIN: 260,
  POINT_TOP: -15,
  POINT_TOP_AFTER: -20,
  POINT_TOP_BEFORE: -23,
  TOP: 40
}

class Tooltip extends Component {
  state = {
    description: '',
    header: '',
    hover: false,
    margin: LEFT_TOP.MARGIN,
    match: false,
    pointBorderAfter: LEFT_TOP.POINT_BORDER_AFTER,
    pointBorderBefore: LEFT_TOP.POINT_BORDER_BEFORE,
    pointMargin: LEFT_TOP.POINT_MARGIN,
    pointTop: LEFT_TOP.POINT_TOP,
    pointTopAfter: LEFT_TOP.POINT_TOP_AFTER,
    pointTopBefore: LEFT_TOP.POINT_TOP_BEFORE,
    top: LEFT_TOP.TOP,
    width: WIDTH
  }

  componentDidMount() {
    glossary.contents.forEach(glossaryItem => {
      if (
        includes(
          glossaryItem.match.map(word => word.toLowerCase()),
          // In v4 text field in a React.Node,
          // so to get string we need to use it's children
          this.props.text.props.children.replace(/\n/g, ' ').toLowerCase()
        )
      ) {
        this.setState({
          description: glossaryItem.desc,
          header: glossaryItem.name,
          match: true
        })
      }
    })
  }

  tooltipPositionEval = () => {
    const headerHeight = document.getElementsByClassName('header')[0]
      .offsetHeight
    const markdownBody = document.getElementsByClassName('markdown-body')[0]
    const tooltipBoundary = document
      .getElementById(`tooltip-text-${this.props.id}`)
      .getBoundingClientRect()
    const tooltipBoxHeight = document.getElementById(
      `tooltip-box-${this.props.id}`
    ).offsetHeight
    const tooltipHeight = tooltipBoundary.top - tooltipBoxHeight
    const maxWidth = markdownBody.offsetLeft + markdownBody.clientWidth
    const container = document.getElementsByClassName('tooltip-container')[0]
    const tooltipWidth = container.offsetLeft + this.state.width
    const vertical = tooltipHeight > headerHeight ? 'top' : 'bottom'
    const horizontal = tooltipWidth > maxWidth ? 'right' : 'left'

    switch (`${horizontal} ${vertical}`) {
      case 'left top':
        this.setState({
          margin: LEFT_TOP.MARGIN,
          pointBorderAfter: LEFT_TOP.POINT_BORDER_AFTER,
          pointBorderBefore: LEFT_TOP.POINT_BORDER_BEFORE,
          pointMargin: LEFT_TOP.POINT_MARGIN,
          pointTop: LEFT_TOP.POINT_TOP,
          pointTopAfter: LEFT_TOP.POINT_TOP_AFTER,
          pointTopBefore: LEFT_TOP.POINT_TOP_BEFORE,
          top: -tooltipBoxHeight - 5
        })
        break
      case 'right top':
        this.setState({
          margin: RIGHT_TOP.MARGIN,
          pointBorderAfter: RIGHT_TOP.POINT_BORDER_AFTER,
          pointBorderBefore: RIGHT_TOP.POINT_BORDER_BEFORE,
          pointMargin: RIGHT_TOP.POINT_MARGIN,
          pointTop: RIGHT_TOP.POINT_TOP,
          pointTopAfter: RIGHT_TOP.POINT_TOP_AFTER,
          pointTopBefore: RIGHT_TOP.POINT_TOP_BEFORE,
          top: -tooltipBoxHeight - 5
        })
        break
      case 'left bottom':
        this.setState({
          margin: LEFT_BOTTOM.MARGIN,
          pointBorderAfter: LEFT_BOTTOM.POINT_BORDER_AFTER,
          pointBorderBefore: LEFT_BOTTOM.POINT_BORDER_BEFORE,
          pointMargin: LEFT_BOTTOM.POINT_MARGIN,
          pointTop: LEFT_BOTTOM.POINT_TOP,
          pointTopAfter: LEFT_BOTTOM.POINT_TOP_AFTER,
          pointTopBefore: LEFT_BOTTOM.POINT_TOP_BEFORE,
          top: LEFT_BOTTOM.TOP
        })
        break
      case 'right bottom':
        this.setState({
          margin: RIGHT_BOTTOM.MARGIN,
          pointBorderAfter: RIGHT_BOTTOM.POINT_BORDER_AFTER,
          pointBorderBefore: RIGHT_BOTTOM.POINT_BORDER_BEFORE,
          pointMargin: RIGHT_BOTTOM.POINT_MARGIN,
          pointTop: RIGHT_BOTTOM.POINT_TOP,
          pointTopAfter: RIGHT_BOTTOM.POINT_TOP_AFTER,
          pointTopBefore: RIGHT_BOTTOM.POINT_TOP_BEFORE,
          top: RIGHT_BOTTOM.TOP
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
    if (this.state.match) {
      return (
        <>
          <OnlyDesktop>
            {this.state.hover && (
              <TooltipContainer
                className="tooltip-container"
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
                  <div className="header">{this.state.header}</div>
                  <ReactMarkdown source={this.state.description} />
                </TooltipText>
              </TooltipContainer>
            )}
            <HighlightedText
              onMouseOver={this.hoverIn}
              onMouseLeave={this.hoverOut}
              onFocus={this.hoverIn}
              onBlur={this.hoverOut}
            >
              <span id={`tooltip-text-${this.props.id}`}>
                {this.props.text}
              </span>
            </HighlightedText>
          </OnlyDesktop>
          <OnlyMobile>
            <span>{this.props.text}</span>
          </OnlyMobile>
        </>
      )
    } else {
      return <span>{this.props.text}</span>
    }
  }
}

Tooltip.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired
}

const HighlightedText = styled.span`
  border-bottom: 1px black dotted;
`

const TooltipContainer = styled.div`
  position: absolute;
  display: inline-block;
  z-index: 300000000;
  background-color: white;
`

const TooltipText = styled.div`
  padding: 8px 10px;
  border: 1px solid #d1d5da;
  border-radius: 3px;
  background-color: white;
  position: absolute;
  z-index: 1;
  top: ${props => {
    if (props.top === 'unset') {
      return 'unset'
    } else {
      return `${props.top}px`
    }
  }};
  margin-left: ${props => props.margin || -70}px;
  width: ${props => props.width || 400}px;

  &:after,
  &:before {
    content: '';
    position: absolute;
    top: ${props => props.pointTop}%;
    border-style: solid;
    margin-left: ${props => props.pointMargin || -15}px;
  }

  &:after {
    top: ${props => props.pointTopAfter}px;
    left: 10%;
    border-width: 10px;
    border-color: ${props => props.pointBorderAfter};
  }
  &:before {
    top: ${props => props.pointTopBefore}px;
    left: 10%;
    border-width: 11px;
    border-color: ${props => props.pointBorderBefore};
  }

  .header {
    font-size: 1.3em;
    font-weight: bold;
  }
`

export default Tooltip
