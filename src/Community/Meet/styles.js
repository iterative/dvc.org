import styled from 'styled-components'
import { media } from '../../styles'

export const Stats = styled.div`
  ${media.tablet`
    display: flex;
    flex-direction: row;
    margin-top: 15px;
  `}
`

export const StatLabel = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: #838d93;
`

export const StatLine = styled.div`
  display: flex;
  align-items: center;
  margin-top: 25px;

  ${media.tablet`
    flex-direction: column;
    flex-basis: 50%;
    align-items: flex-start;
    margin: 0;

    & + & {
      margin-left: 25px;
    }
  `}
`

export const StatValue = styled.div`
  flex: 0 0 124px;
  margin-right: 20px;
  font-size: 40px;
  font-family: BrandonGrotesqueBlack;
  text-align: right;
  line-height: 50px;
  color: #24292e;

  ${media.tablet`
    flex: initial;
    font-size: 30px;
    font-family: BrandonGrotesque;
    line-height: 40px;
  `}
`
