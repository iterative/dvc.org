import styled, { css } from 'styled-components'

export const Handler = styled.span`
  position: relative;
  display: inline-block;
  width: 186px;
  height: 60px;
`

export const Button = styled.button`
  position: relative;
  width: 186px;
  height: 60px;
  border: none;
  border-radius: 4px;
  background-color: #945dd6;

  padding: 0px;
  color: #ffffff;

  cursor: pointer;
  z-index: 9;

  display: flex;
  flex-direction: row;
  align-items: center;
  transition: 0.2s background-color ease-out;

  ${props =>
    props.open &&
    `
    background-color: #885CCB;
  `} &:hover {
    background-color: #885ccb;
  }
`

export const Icon = styled.div`
  flex-basis: 48px;

  text-align: center;
`

export const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`

export const Action = styled.h6`
  font-family: BrandonGrotesqueMed;
  font-size: 20px;
  line-height: 0.9;
`

export const Description = styled.p`
  font-family: BrandonGrotesque;
  font-size: 14px;
  text-align: left;
`

export const Triangle = styled.div`
  margin-right: 19px;
  align-items: center;
  display: flex;

  transition: left 300ms linear;

  ${props =>
    props.open &&
    `
    transition: left 300ms linear;
    transform: rotate(-180deg);
  `};
`

export const Popup = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  top: calc(100% + 3px);
  background-color: #ffffff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);

  ${props =>
    props.openTop &&
    `
    bottom: calc(100% + 3px);
    top: auto;
  `};
`

export const Links = styled.div`
  display: flex;
  flex-direction: column;
`

const Item = css`
  font-family: BrandonGrotesque;
  display: block;
  min-height: 36px;
  line-height: 1.29;
  padding: 0px 17px;

  display: flex;
  align-items: center;
  text-decoration: none;

  color: #b0b8c5;
`

export const Delimiter = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  height: 1px;
`

export const DownloadInput = styled.input`
  ${Item};
  border: none !important;
  font-family: Monospace;
  font-weight: bold;

  ${props =>
    props.active &&
    `
    color: #40364d;
  `};
`

export const DownloadLink = styled.a`
  ${Item};
  color: #b0b8c5;

  &:hover {
    color: #40364d;
  }

  ${props =>
    props.active &&
    `
    color: #40364d;
  `};
`
