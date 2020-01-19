import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Modal from '../Modal'

class MobileView extends Component {
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

const HighlightedText = styled.span`
  border-bottom: 1px black dotted;
`

const ModalBackground = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
`

const CloseContainer = styled.div`
  float: right;
  margin: 2px 10px 0 0;
`
const Line = styled.div`
  position: absolute;
  height: 23px;
  width: 2px;
  background-color: black;

  ${props =>
    props.first &&
    `
      transform: rotate(-45deg);
  `}

  ${props =>
    props.second &&
    `
      transform: rotate(45deg);
  `}
`

const ModalContent = styled.div`
  width: 80%;
  background-color: #ffffff;
  padding: 8px 10px;
  border: 1px solid #d1d5da;
  border-radius: 3px;

  .portal-font {
    font-family: BrandonGrotesque;
  }
`

const Header = styled.div`
  font-size: 1.3em;
  font-weight: bold;
`

export default MobileView
