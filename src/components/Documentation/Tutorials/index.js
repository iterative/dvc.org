import React from 'react'
import PropTypes from 'prop-types'
import topairs from 'lodash.topairs'
import startCase from 'lodash.startcase'

import { ExternalButton, KatacodaButton, Wrapper } from './styles'

const icons = {
  katacoda: KatacodaButton
}

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
