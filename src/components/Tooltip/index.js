import React, { Component } from 'react'
import PropTypes from 'prop-types'
import includes from 'lodash.includes'

import DesktopView from './DesktopView'
import MobileView from './MobileView'

import glossary from '../../../content/docs/glossary'

import { OnlyDesktopInline, OnlyMobileInline } from '../../styles'

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
          this.props.text.replace(/\n/g, ' ').toLowerCase()
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
          <OnlyDesktopInline>
            <DesktopView
              description={this.state.description}
              header={this.state.header}
              id={this.props.text}
              text={this.props.text}
            />
          </OnlyDesktopInline>
          <OnlyMobileInline>
            <MobileView
              description={this.state.description}
              header={this.state.header}
              text={this.props.text}
            />
          </OnlyMobileInline>
        </>
      )
    } else {
      return <span>{this.props.text}</span>
    }
  }
}

Tooltip.propTypes = {
  text: PropTypes.node.isRequired
}

export default Tooltip
