import React, { Component } from 'react'

import Collapse from 'react-collapse'
import PropTypes from 'prop-types'
import { presets } from 'react-motion'
import styled from 'styled-components'

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
      <Wrapper onClick={this.toggleCollapsed}>
        {header}
        <Collapse isOpened={isOpened} springConfig={presets.gentle}>
          {children}
        </Collapse>
        {!isOpened && <MoreText>More...</MoreText>}
      </Wrapper>
    )
  }
}

TextCollapse.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.node.isRequired
}

export default TextCollapse

const Wrapper = styled.button`
  text-align: left;
  border: none;
  appearance: none;
  background: none;
  font-family: BrandonGrotesque, Tahoma, Arial;
`

const MoreText = styled.div`
  color: #13adc7;
  font-size: 16px;
`
