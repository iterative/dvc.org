import React, { Component } from 'react'
import ReactPopover from 'react-popover'
import { injectGlobal } from 'styled-components'

class Popover extends Component {
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
      <ReactPopover isOpen={isOpen} onOuterAction={this.closePopover} {...rest}>
        <div ref={ref => (this.trigger = ref)}>{children}</div>
      </ReactPopover>
    )
  }
}

export default Popover

injectGlobal`
  .Popover {
    
    .Popover-body {
      box-shadow: rgba(0,0,0,0.14) 0px 0px 4px, rgba(0,0,0,0.28) 0px 4px 8px;
      padding: 5px 15px;
      background: white;
      color: black;
    }

    .Popover-tip {
      display: none;
    }
  }
`
