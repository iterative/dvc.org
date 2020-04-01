import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
`

export const Handler = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  overflow: hidden;
  background: #000;

  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;

  background-color: rgba(23, 23, 23, 0.59);

  @media (max-width: 768px) {
    width: 100%;
  }

  iframe,
  object,
  embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .ytplayer {
      pointer-events: none;
      position: absolute;
    }
  }
`

export const Overflow = styled.div`
  position: absolute;
  z-index: 1;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: rgba(23, 23, 23, 0.59);
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Box = styled.div`
  width: 186px;
  height: 60px;
`

export const Button = styled.button`
  cursor: pointer;
  align-items: center;
  width: 100%;
  height: 60px;
  border-radius: 4px;
  border: none;

  display: flex;
  flex-direction: row;
  padding: 0px;

  text-decoration: none;
  color: #ffffff;
  border: none;
  background-color: #13adc7;

  &:hover {
    background-color: #13a3bd;
  }

  ${props =>
    props.disabled &&
    `
    background-color: #b0b8c5;
    &:hover {
      background-color: #b0b8c5;
    }
  `};
`

export const ButtonIcon = styled.div`
  flex-basis: 48px;

  text-align: center;
  padding-top: 4px;
`

export const ButtonInner = styled.div``

export const Action = styled.h6`
  font-family: BrandonGrotesque, Tahoma, Arial;
  font-size: 20px;
  font-weight: 500;
  line-height: 0.9;
`
export const Description = styled.p`
  font-size: 12px;
  text-align: left;
  line-height: 1.29;
`
