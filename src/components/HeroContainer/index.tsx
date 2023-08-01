import React from 'react'
import cn from 'classnames'

import LayoutWidthContainer from '@dvcorg/gatsby-theme-iterative/src/components/LayoutWidthContainer'

interface IHeroContainerProps {
  className?: string
  children: React.ReactNode
}

const HeroContainer: React.FC<IHeroContainerProps> = ({
  className,
  children
}) => (
  <div className={cn('w-full', className)}>
    <LayoutWidthContainer>{children}</LayoutWidthContainer>
  </div>
)

export default HeroContainer
