import styled from 'styled-components'

export const HighlightedText = styled.span`
  border-bottom: 1px black dotted;
`

export const ModalBackground = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
`

export const CloseContainer = styled.div`
  float: right;
  margin: 2px 10px 0 0;
`
export const Line = styled.div`
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

export const ModalContent = styled.div`
  width: 80%;
  background-color: #ffffff;
  padding: 8px 10px;
  border: 1px solid #d1d5da;
  border-radius: 3px;

  .portal-font {
    font-family: BrandonGrotesque;
  }
`

export const Header = styled.div`
  font-size: 1.3em;
  font-weight: bold;
`
