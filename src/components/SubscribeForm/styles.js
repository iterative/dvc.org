import styled from 'styled-components'

import { media } from '../../styles'

export const Form = styled.form`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: #ffffff;
  display: flex;

  ${media.phablet`
    flex-direction: column;
  `};
`

export const Input = styled.input`
  font-family: BrandonGrotesqueMed;
  display: flex;
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 8px 0px 0px 8px;
  font-size: 20px;
  font-weight: 500;

  ${media.phablet`
    border-radius: 4px 4px 0px 0px;
  `};
`

export const Button = styled.button`
  font-family: BrandonGrotesqueMed;
  width: 115px;
  border: none;
  border-radius: 0px 8px 8px 0px;
  background-color: #e4fbff;
  font-size: 20px;
  font-weight: 500;
  color: #13adc7;
  cursor: pointer;

  &:hover {
    background-color: #daf1f5;
  }

  ${media.phablet`
    min-height: 60px;
    width: 100%;
    border-radius: 0px 0px 4px 4px;
    justify-content: center;
  `};
`
