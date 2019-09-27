import React, { Component } from 'react'
import PropTypes from 'prop-types'
import includes from 'lodash.includes'

import glossary from '../Documentation/glossary'
import { OnlyDesktop, OnlyMobile } from '../styles'
import DesktopView from './desktop-view'
import MobileView from './mobile-view'

class Tooltip extends Component {
  state = {
    description: '',
    header: '',
    match: false
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

  render() {
    if (this.state.match) {
      return (
        <>
          <OnlyDesktop>
            <DesktopView
              description={this.state.description}
              header={this.state.header}
              id={this.props.id}
              text={this.props.text}
            />
          </OnlyDesktop>
          <OnlyMobile>
            <MobileView
              description={this.state.description}
              header={this.state.header}
              text={this.props.text}
            />
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

export default Tooltip
