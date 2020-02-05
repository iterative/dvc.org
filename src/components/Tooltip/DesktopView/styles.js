import styled from 'styled-components'

export const HighlightedText = styled.span`
  border-bottom: 1px black dotted;
`

export const TooltipContainer = styled.div`
  position: absolute;
  display: inline-block;
  z-index: 300000000;
  background-color: white;
`

export const TooltipText = styled.div`
  color: black;
  padding: 8px 10px;
  border: 1px solid #d1d5da;
  border-radius: 3px;
  background-color: white;
  position: absolute;
  z-index: 1;
  top: ${props => {
    if (props.top === 'unset') {
      return 'unset'
    } else {
      return `${props.top}px`
    }
  }};
  margin-left: ${props => props.margin || -70}px;
  width: ${props => props.width || 400}px;

  &:after,
  &:before {
    content: '';
    position: absolute;
    top: ${props => props.pointTop}%;
    border-style: solid;
    margin-left: ${props => props.pointMargin || -15}px;
  }

  &:after {
    top: ${props => props.pointTopAfter}px;
    left: 10%;
    border-width: 10px;
    border-color: ${props => props.pointBorderAfter};
  }
  &:before {
    top: ${props => props.pointTopBefore}px;
    left: 10%;
    border-width: 11px;
    border-color: ${props => props.pointBorderBefore};
  }

  .header {
    font-size: 1.3em;
    font-weight: bold;
  }
`
