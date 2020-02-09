import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Cursor, Wrapper } from './styles'

export default class TextRotate extends Component {
  static defaultProps = {
    words: [],
    delay: 80,
    wordDelay: 1000,
    textBefore: ``,
    textAfter: ``
  }

  state = {
    ready: false,
    currentWordIndex: 0,
    pos: 1,
    length: 0,
    grow: true,
    timer: null
  }

  componentDidMount() {
    this.initTimer()
    this.setState({
      grow: true,
      ready: true
    })
  }

  componentWillUnmount() {
    this.deinitTimer()
  }

  initTimer() {
    const word = this.props.words[this.state.currentWordIndex]

    this.setState({
      pos: word.length,
      grow: false
    })

    setTimeout(() => {
      const timer = setInterval(this.animate, this.props.delay)
      this.setState({
        timer
      })
    }, this.props.wordDelay)
  }

  deinitTimer() {
    clearTimeout(this.state.timer)
  }

  animate = () => {
    if (
      this.state.pos === this.props.words[this.state.currentWordIndex].length
    ) {
      this.setState(
        prevState => ({
          grow: !prevState.grow
        }),
        () => {
          if (!this.state.grow) {
            clearInterval(this.state.timer)
            this.initTimer()
          }
        }
      )
    }

    if (!this.state.grow && this.state.pos === 0) {
      return this.nextWord()
    }

    if (this.state.grow) {
      this.setState(prevState => ({
        pos: prevState.pos + 1
      }))
    } else {
      this.setState(prevState => ({
        pos: prevState.pos - 1
      }))
    }
  }

  nextWord = () => {
    let nextWordIndex = this.state.currentWordIndex + 1
    if (nextWordIndex > this.props.words.length - 1) {
      nextWordIndex = 0
    }

    this.setState(() => ({
      currentWordIndex: nextWordIndex,
      pos: 0,
      grow: true
    }))
  }

  getCurrentWord() {
    const currentWord = this.props.words[this.state.currentWordIndex]

    if (!this.state.ready) return currentWord

    return currentWord.slice(0, this.state.pos + 1)
  }

  render() {
    const { textBefore, textAfter } = this.props
    const word = this.getCurrentWord()

    return (
      <Wrapper>
        <p>{textBefore}</p>{' '}
        <p>
          {word}
          <Cursor>|</Cursor>{' '}
        </p>
        <p>{textAfter}</p>
      </Wrapper>
    )
  }
}

TextRotate.propTypes = {
  textBefore: PropTypes.string.isRequired,
  textAfter: PropTypes.string.isRequired,
  delay: PropTypes.number.isRequired,
  words: PropTypes.arrayOf(PropTypes.string).isRequired,
  wordDelay: PropTypes.number.isRequired
}
