import React from 'react'
import cn from 'classnames'

import LayoutWidthContainer from '@dvcorg/gatsby-theme-iterative/src/components/LayoutWidthContainer'

interface IHeroContainerProps {
  className?: string
  children: React.ReactNode
  id?: HTMLDivElement['id']
}

const HeroContainer: React.FC<IHeroContainerProps> = ({
  className,
  children,
  id
}) => (
  <div className={cn('w-full', className)} id={id}>
    <LayoutWidthContainer>{children}</LayoutWidthContainer>
  </div>
)

export default HeroContainer
