import styled from 'styled-components'
import { media } from '../../../styles'

export const Wrapper = styled.div`
  margin: 0 auto;
  padding: 40px 0 20px;
  max-width: 1000px;

  ${media.tablet`
    padding: 0 0 10px;
  `}
`

export const Link = styled.a`
  &:hover {
    opacity: 0.7;
  }
`

export const Picture = styled.img`
  max-width: 1000px;
  width: 100%;
`
