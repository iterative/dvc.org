import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactPopover from 'react-popover'

import { GlobalStyle } from './styles'

export default class Popover extends Component {
  constructor() {
    super()
    this.state = {
      isOpen: false
    }
  }

  componentDidMount() {
    if (this.trigger) {
      this.trigger.addEventListener('click', this.togglePopover)
    }
  }

  componentWillUnmount() {
    if (this.trigger) {
      this.trigger.removeEventListener('click', this.togglePopover)
    }
  }

  togglePopover = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  }

  closePopover = () => this.setState({ isOpen: false })

  render() {
    const { children, ...rest } = this.props
    const { isOpen } = this.state

    return (
      <>
        <GlobalStyle />
        <ReactPopover
          isOpen={isOpen}
          onOuterAction={this.closePopover}
          {...rest}
        >
          <div ref={ref => (this.trigger = ref)}>{children}</div>
        </ReactPopover>
      </>
    )
  }
}

Popover.propTypes = {
  children: PropTypes.node.isRequired
}
