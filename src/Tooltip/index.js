import React, { Component } from 'react'
import styled from 'styled-components'

import glossary from '../Documentation/glossary'

class Tooltip extends Component {
  state = {
    hover: false,
    timeout: null
  }

  hoverIn = () => {
    if (this.state.interval) {
      clearTimeout(this.state.interval)
      this.setState({
        interval: null,
        hover: true
      })
    } else {
      this.setState({
        hover: true
      })
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
    let pronounce = ''
    let description = ''
    glossary.contents.forEach(glossaryItem => {
      if (glossaryItem.match.includes(text)) {
        header = glossaryItem.name
        pronounce = glossaryItem.enun
        description = glossaryItem.desc
      }
    })
    return (
      <>
        <span onMouseOver={this.hoverIn} onMouseLeave={this.hoverOut}>
          {text}
          <sup>✝</sup>
        </span>
        {this.state.hover && (
          <TooltipContainer
            onMouseOver={this.hoverIn}
            onMouseLeave={this.hoverOut}
          >
            <TooltipText>
              <div className="header">{header}</div>
              <div className="pronounce">{pronounce}</div>
              <div>{description}</div>
            </TooltipText>
          </TooltipContainer>
        )}
      </>
    )
  }
}

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
  margin-left: -70px;
  width: 400px;

  &:after,
  &:before {
    content: '';
    position: absolute;
    top: 100%;
    border-style: solid;
    margin-left: -5px;
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
  .pronounce {
    font-size: 0.9em;
    color: #6a737d;
    margin: -5px 0 5px 0;
  }
`

export default Tooltip
