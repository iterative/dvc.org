import { LightButton } from './LightButton'
import PropTypes from 'prop-types'
import React from 'react'
import startCase from 'lodash.startcase'
import styled from 'styled-components'
import topairs from 'lodash.topairs'

export default function Tutorials({ compact, tutorials }) {
  const tutorialsData = topairs(tutorials)

  return (
    <Wrapper compact={compact}>
      {tutorialsData.map(([k, value]) => {
        const ButtonComponent = icons[k] || ExternalButton

        return (
          <ButtonComponent
            href={value}
            key={value}
            target="_blank"
            rel="noopener nofollow"
            compact={compact}
          >
            {icons[k] && <i />}
            {!compact && `Run in ${startCase(k)}`}
          </ButtonComponent>
        )
      })}
    </Wrapper>
  )
}

Tutorials.propTypes = {
  compact: PropTypes.bool,
  tutorials: PropTypes.object
}

const Wrapper = styled.div``

const ExternalButton = styled(LightButton)`
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

const KatacodaButton = styled(ExternalButton)`
  white-space: nowrap;

  i {
    background-image: url(/static/img/katacoda_grey_small.png);
    width: 24px;
    height: 24px;
  }
`
const icons = {
  katacoda: KatacodaButton
}
