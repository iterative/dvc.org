import styled from 'styled-components'

import { Meta as ParentMeta } from '../styles'

export const Image = styled.img`
  width: 100%;
  border-radius: 5px 5px 0 0;
`

export const ImageWrapper = styled.a`
  display: block;
  margin: -10px -20px 0;
`

export const Meta = styled(ParentMeta)`
  margin-top: 10px;
`
