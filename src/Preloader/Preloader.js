import React from 'react'

export default class Preloader extends React.Component {
  render() {
    return (
      <img
        style={{
          width: `${this.props.size}px`,
          height: `${this.props.size}px`,
          display: 'block',
          opacity: '.5'
        }}
        src={'/static/img/preloader.gif'}
        alt=""
      />
    )
  }
}
