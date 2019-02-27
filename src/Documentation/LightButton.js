import styled from 'styled-components'

export const LightButton = styled.a`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #575e64;
  background-color: white;
  border: 1px solid #575e64;
  text-decoration: none;
  font-weight: 600;
  line-height: 30px;
  padding: 2px 16px;
  border-radius: 3px;
  cursor: pointer;
  transition: 0.2s background-color ease-out;
  z-index: 1

  &:hover {
    background-color: #f5f7f9;
  }

  i {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width: 1em;
    height: 1em;
    margin-right: 7px;
  }
`
