import styled from 'styled-components'

export const Wrapper = styled.div`
  overflow: hidden;
`

export const Bodybag = styled.div`
  position: fixed;
  top: 80px;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  transition: top 0.2s linear;
  -webkit-overflow-scrolling: touch;

  ${({ enableSmoothScroll }) =>
    enableSmoothScroll &&
    `
    scroll-behavior: smooth;
    will-change: scroll-position;
  `}
`

export const ModalRoot = styled.div`
  position: fixed;
  z-index: 100000;
`
