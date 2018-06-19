import React, { Component } from 'react'
import styled from 'styled-components'
import Collapse from 'react-collapse'

class TextCollapse extends Component {
  state = {
    collapsed: true
  }

  toggleCollapsed = () => {
    this.setState((prevState) => ({
      collapsed: !prevState.collapsed
    }))
  }

  render() { 
    const { children, minHeight } = this.props;
    const { collapsed } = this.state;

    return (
      <Collapse isOpened onClick={this.toggleCollapsed}>
        <TextWrapper collapsed={collapsed} minHeight={minHeight}>
          {children}
        </TextWrapper>
        {collapsed && <MoreText>More...</MoreText>}
      </Collapse>
    )
  }
}

TextCollapse.defaultProps = {
  minHeight: 63
}

export default TextCollapse

const TextWrapper = styled.div`
  height: ${props => props.collapsed ? `${props.minHeight}px` : 'auto'};
  overflow: hidden;
`;

const MoreText = styled.span`
  color: #13adc7;
`;