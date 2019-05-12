import React, { Component } from 'react'
import styled from 'styled-components'
import Collapse from 'react-collapse'
import { presets } from 'react-motion'

class TextCollapse extends Component {
  state = {
    isOpened: false
  }

  toggleCollapsed = () => {
    this.setState(prevState => ({
      isOpened: !prevState.isOpened
    }))
  }

  render() {
    const { children, header } = this.props
    const { isOpened } = this.state

    return (
      <div onClick={this.toggleCollapsed}>
        {header}
        <Collapse isOpened={isOpened} springConfig={presets.gentle}>
          {children}
        </Collapse>
        {!isOpened && <MoreText>More...</MoreText>}
      </div>
    )
  }
}

export default TextCollapse

const MoreText = styled.div`
  color: #13adc7;
`
