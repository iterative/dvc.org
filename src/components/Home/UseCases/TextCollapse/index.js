import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'react-collapse'

import { MoreText, Wrapper } from './styles'

export default class TextCollapse extends Component {
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
        <Collapse isOpened={isOpened}>{children}</Collapse>
        {!isOpened && <MoreText>More...</MoreText>}
      </Wrapper>
    )
  }
}

TextCollapse.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.node.isRequired
}
