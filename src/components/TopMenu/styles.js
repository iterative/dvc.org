import styled from 'styled-components'

import { media } from '../../styles'

const MIN_HEIGHT = 78

export const Wrapper = styled.div`
  position: fixed;
  z-index: 10;
  top: 0px;
  left: 0px;
  right: 0px;

  background-color: #ffffff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);

  &::-webkit-scrollbar {
    visibility: hidden;
  }
`

export const Container = styled.section`
  margin: 0 auto;
  padding: 0px 15px;
  max-width: ${props => (props.wide ? '1200px' : '1005px')};
  min-height: ${MIN_HEIGHT}px;
  width: auto;

  ${props => `
    height: ${MIN_HEIGHT + (props.scrolled ? 0 : 20)}px;
  `};

  z-index: 3;
  position: relative;
  color: #ffffff;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  transition: height 0.2s linear;
  will-change: height;

  ${media.phablet`
    flex-direction: column;
    justify-content: center;
    align-items: start;
    height: auto;
  `};
`

export const Logo = styled.a`
  display: block;
  padding-top: 10px;
  z-index: 999;

  ${media.phablet`
    padding-top: 10px;
    padding-bottom: 0px;
  `};
`
