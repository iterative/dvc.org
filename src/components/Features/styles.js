import styled from 'styled-components'

import { container, media } from '../../styles'

export const Container = styled.div`
  ${container};
`

export const Features = styled.div`
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  padding-top: 110px;
  padding-bottom: 90px;

  ${media.phablet`
    padding-top: 70px;
    padding-bottom: 50px;
  `};
`

export const Feature = styled.div`
  flex: 33.3%;
  flex-basis: 311px;
  margin-bottom: 63px;
`

export const Icon = styled.div`
  height: 48px;

  img {
    width: 48px;
    height: 48px;
  }
`

export const Name = styled.h3`
  font-family: BrandonGrotesque;
  margin-top: 10px;
  margin-bottom: 10px;

  font-size: 20px;
  font-weight: 500;
  color: #40364d;

  min-height: 28px;
`

export const Description = styled.div`
  max-width: 311px;

  font-size: 16px;
  color: #5f6c72;
`
