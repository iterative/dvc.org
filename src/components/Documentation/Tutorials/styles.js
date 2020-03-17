import styled from 'styled-components'

import { LightButton } from '../styles'

export const Wrapper = styled.div``

export const ExternalButton = styled(LightButton)`
  box-sizing: border-box;
  min-height: 36px;

  ${({ compact }) =>
    !compact &&
    `
      width: 100%;
      margin: 10px 0;
  `}

  ${({ compact }) =>
    compact &&
    `
      margin-left: 5px;

      i {
        margin-right: 0;
      }
  `}
`

export const KatacodaButton = styled(ExternalButton)`
  white-space: nowrap;

  i {
    background-image: url(/img/katacoda_grey_small.png);
    width: 24px;
    height: 24px;
  }
`
