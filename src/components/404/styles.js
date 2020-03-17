import styled from 'styled-components'
import { media } from '../../styles'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 100px auto 150px;
`

export const Title = styled.h1`
  ${media.desktop`
    font-weight: 500;
    font-size: 30px;
    line-height: 40px;
  `}

  font-family: BrandonGrotesqueMed;
  font-size: 40px;
  line-height: 60px;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
`

export const Content = styled.div`
  ${media.desktop`
    padding: 0 15px;
    text-align: center;
    font-size: 20px;
    line-height: 30px;
  `}

  padding: 0;
  text-align: left;
  font-size: 24px;
  line-height: 34px;
`
