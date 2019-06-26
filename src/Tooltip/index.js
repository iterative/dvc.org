import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'

import glossary from '../Documentation/glossary'

class Tooltip extends Component {
  state = {
    hover: false,
    timeout: null,
    width: 400,
    margin: -70,
    pointMargin: -15
  }

  tooltipWidthEval = () => {
    const markdownBody = document.getElementsByClassName('markdown-body')[0]
    const maxWidth = markdownBody.offsetLeft + markdownBody.clientWidth
    const container = document.getElementsByClassName('tooltip-container')[0]
    const tooltipWidth = container.offsetLeft + this.state.width
    if (tooltipWidth > maxWidth) {
      this.setState({
        margin: -340,
        pointMargin: 260
      })
    } else {
      this.setState({
        margin: -70,
        pointMargin: -15
      })
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
        this.tooltipWidthEval
      )
    } else {
      this.setState(
        {
          hover: true
        },
        this.tooltipWidthEval
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
    const { text } = this.props
    let header = ''
    let description = ''
    glossary.contents.forEach(glossaryItem => {
      if (glossaryItem.match.includes(text)) {
        header = glossaryItem.name
        description = glossaryItem.desc
      }
    })
    return (
      <>
        <HighlightedText
          onMouseOver={this.hoverIn}
          onMouseLeave={this.hoverOut}
        >
          {text}
        </HighlightedText>
        {this.state.hover && (
          <TooltipContainer
            className="tooltip-container"
            onMouseOver={this.hoverIn}
            onMouseLeave={this.hoverOut}
          >
            <TooltipText
              margin={this.state.margin}
              width={this.state.width}
              pointMargin={this.state.pointMargin}
            >
              <div className="header">{header}</div>
              <ReactMarkdown source={description} />
            </TooltipText>
          </TooltipContainer>
        )}
      </>
    )
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
  bottom: 90%;
  margin-left: ${props => props.margin || -70}px;
  width: ${props => props.width || 400}px;

  &:after,
  &:before {
    content: '';
    position: absolute;
    top: 100%;
    border-style: solid;
    margin-left: ${props => props.pointMargin || -15}px;
  }

  &:after {
    left: 10%;
    border-width: 10px;
    border-color: white transparent transparent transparent;
  }
  &:before {
    left: 10%;
    border-width: 11px;
    border-color: #d1d5da transparent transparent transparent;
  }

  .header {
    font-size: 1.3em;
    font-weight: bold;
  }
`

export default Tooltip
