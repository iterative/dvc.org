import styled from 'styled-components'
import { media } from '../../../styles'

export const Action = styled.div`
  margin-top: 20px;
`

export const Content = styled.div`
  flex-grow: 1;
  font-size: 16px;
  line-height: 24px;
  color: #838d93;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #d8dfe3;
  font-family: BrandonGrotesque;
  font-size: 24px;
  font-weight: 500;
  line-height: 34px;
  color: #24292e;

  ${media.tablet`
    margin: 0;
    border: none;
    font-size: 20px;
    line-height: 30px;
  `}
`

export const Icon = styled.img`
  margin: 0 -2px 0 0;

  ${media.tablet`
    display: none;
  `}
`

export const Wrapper = styled.div`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  width: 100%;
  padding: 10px 20px 20px;
  border-radius: 20px;
  background: #eef4f8;
`
