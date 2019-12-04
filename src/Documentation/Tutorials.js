import React from 'react'
import PropTypes from 'prop-types'
import topairs from 'lodash.topairs'
import startCase from 'lodash.startcase'
import styled from 'styled-components'

import { LightButton } from './LightButton'

export default function Tutorials({ compact, tutorials }) {
  const tutorialsData = topairs(tutorials)

  return (
    <Wrapper compact={compact}>
      {tutorialsData.map(([key, value]) => {
        const ButtonComponent = icons[key] || ExternalButton

        return (
          <ButtonComponent
            href={value}
            key={value}
            target="_blank"
            rel="noopener nofollow"
            compact={compact}
          >
            {icons[key] && <i />}
            {!compact && `Run in ${startCase(key)}`}
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
  i {
    background-image: url(/static/tutorial-icons/katacoda.png);
    width: 24px;
    height: 24px;
  }
`
const icons = {
  katacoda: KatacodaButton
}
