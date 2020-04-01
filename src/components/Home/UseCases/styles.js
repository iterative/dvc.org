import styled from 'styled-components'

import { container, media } from '../../../styles'

export const Wrapper = styled.section`
  padding-top: 80px;
  padding-bottom: 57px;
`

export const Container = styled.div`
  ${container};
`

export const FlexWrap = styled.div`
  display: flex;
  justify-content: space-between;

  ${media.tablet`
    flex-direction: column;
  `};

  ${media.phablet`
    flex-direction: column-reverse;
  `};
`

export const Video = styled.div`
  display: flex;
  flex: 1 2 60%;
  flex-direction: column;
  width: 100%;
  align-self: center;
  margin-right: 10%;

  ${media.tablet`
    margin-bottom: 20px;
    margin-right: 0;
    flex: auto;
  `};

  ${media.phablet`
    margin: 0;
  `};
`

export const Right = styled.div`
  flex: 1 1 40%;

  ${media.tablet`
    flex: auto;
  `};

  ${media.phablet`
    flex: auto;
  `};
`

export const Heading = styled.div`
  font-family: BrandonGrotesque;
  min-height: 50px;
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  color: #40364d;

  ${media.tablet`
    text-align: left;
  `};
`

export const Cases = styled.div`
  margin-top: 15px;
`

export const Case = styled.div`
  margin-bottom: 18px;
`

export const Top = styled.div`
  height: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const Icon = styled.div`
  margin-right: 8px;
`

export const Title = styled.h3`
  font-family: BrandonGrotesque;
  font-size: 16px;
  font-weight: 500;
  color: #40364d;
`

export const Description = styled.div`
  padding-top: 15px;
  font-size: 16px;
  color: #5f6c72;
`
