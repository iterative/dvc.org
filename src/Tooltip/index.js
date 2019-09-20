import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import includes from 'lodash.includes'

import glossary from '../Documentation/glossary'
import { OnlyDesktop, OnlyMobile } from '../styles'

class Tooltip extends Component {
  state = {
    description: '',
    header: '',
    hover: false,
    id: null,
    margin: -70,
    match: false,
    pointBorderAfter: 'white transparent transparent transparent',
    pointBorderBefore: '#d1d5da transparent transparent transparent',
    pointMargin: -15,
    pointTop: 100,
    pointTopAfter: -14,
    pointTopBefore: 16,
    timeout: null,
    top: 'unset',
    width: 400
  }

  componentDidMount() {
    glossary.contents.forEach((glossaryItem, index) => {
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
          key: index,
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
      .getElementById(`tooltip-text-${this.state.key}`)
      .getBoundingClientRect()
    const tooltipBoxHeight = document.getElementById(
      `tooltip-box-${this.state.key}`
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
    if (this.state.match) {
      return (
        <>
          <OnlyDesktop>
            {this.state.hover && (
              <TooltipContainer
                className="tooltip-container"
                onMouseOver={this.hoverIn}
                onMouseLeave={this.hoverOut}
              >
                <TooltipText
                  id={`tooltip-box-${this.state.key}`}
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
            >
              <span id={`tooltip-text-${this.state.key}`}>
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
