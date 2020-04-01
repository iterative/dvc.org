import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'

import Modal from './Modal'

import {
  CloseContainer,
  Header,
  HighlightedText,
  Line,
  ModalBackground,
  ModalContent
} from './styles'

export default class MobileView extends Component {
  state = {
    visible: false
  }

  openTooltip = e => {
    e.stopPropagation()
    this.setState({
      visible: true
    })
  }

  closeTooltip = e => {
    e.stopPropagation()
    this.setState({
      visible: false
    })
  }

  render() {
    return (
      <>
        <HighlightedText onClick={this.openTooltip}>
          {this.props.text}
        </HighlightedText>
        {this.state.visible && (
          <Modal>
            <ModalBackground onClick={this.closeTooltip}>
              <ModalContent onClick={this.openTooltip}>
                <CloseContainer onClick={this.closeTooltip}>
                  <Line first />
                  <Line second />
                </CloseContainer>
                <Header>{this.props.header}</Header>
                <ReactMarkdown
                  className="markdown-body portal-font"
                  source={this.props.description}
                />
              </ModalContent>
            </ModalBackground>
          </Modal>
        )}
      </>
    )
  }
}

MobileView.propTypes = {
  description: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired
}
