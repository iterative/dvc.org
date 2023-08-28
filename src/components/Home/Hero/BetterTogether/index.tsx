import React from 'react'
import HeroContainer from '../../../HeroContainer'
import { cn } from '../../../../utils'

const BetterTogether = () => {
  return (
    <HeroContainer className="py-14 bg-blue-100">
      <h2 className={cn('text-center text-3xl font-medium')}>
        DVC<sup>X</sup> and DVC: Better Together
      </h2>
      <p className={cn('mt-8', 'text-xl font-normal')}>
        Build the datasets you need without modifying your data sources. Create
        pipelines that connect your versioned datasets, code, and models
        together for effective experiment tracking the GitOps way.
      </p>
    </HeroContainer>
  )
}

export default BetterTogether
